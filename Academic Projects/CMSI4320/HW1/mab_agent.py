"""
mab_agent.py

Agent specifications implementing Action Selection Rules covered
during the lectures... plus some opportunities to explore your
implementations!
"""

from typing import Any
import numpy as np
import random
import itertools
import math

# ----------------------------------------------------------------
# MAB Agent Superclasses
# ----------------------------------------------------------------


class MABAgent:
    """
    MAB Agent superclass designed to abstract common components
    between individual bandit player subclasses (below)
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int]):
        """
        Initializes a new MABAgent given the list of decision variables it must choose
        at each round, and their corresponding cardinalities (i.e., how many values each
        has). Use this to initialize any attributes needed.

        Parameters:
            dec_vars (list[str]):
                The list of decision variables that your agent must choose from at
                each round of the MAB game
            dec_cards (list[int]):
                The list of decision variable cardinalities (i.e., how many values
                the variable can obtain through your choice), with each index
                corresponding to the variable's index in dec_vars

        [!] Each decision variable has choices in the range of their cardinality, e.g.,
        dec_vars =  ["X1", "X2"]
        dec_cards = [2, 4]
        => X1 has values {0, 1} and X2 has values {0, 1, 2, 3}

        [!] WARNING: For any given simulation, an agent is created ONCE and persists
        for ALL Monte Carlo repetitions, but will have its clear_history method called
        between rounds. Your agent should not remember anything between Monte Carlo
        repetitions.
        """
        self.dec_vars = dec_vars
        self.dec_cards = dec_cards

        # [!] TODO: Add whatever attributes or other initialization necessary here!
        self._initialize_history((1, 2))
        self.contextual_agent_history: dict[tuple, tuple] = {}

    def give_feedback(self, a_t: dict[str, int], r_t: int) -> None:
        """
        After your agent's choice a_t has been made in a given trial t, this method
        is called by the environment to tell you if you received a reward r_t or not.
        Used to update your agent's history following its choices.

        Parameters:
            a_t (dict[str, int]):
                A decision mapping of variable mapped to its chosen value, e.g.,
                {"X": 0}
            r_t (int):
                The Bernoulli (i.e., {0, 1}) reward associated with your choice
                for this round.

        [!] This method is called FOR you and should never be called internally

        [!] It's up to YOU to determine your history's data structure and how it's updated
        """
        action: tuple[str, int] = self._action_dict_to_tuple(a_t)
        total_reward, num_chosen = self.history[action]
        self.history[action] = (total_reward + r_t, num_chosen + 1)

    def give_contextual_feedback(
        self, a_t: dict[str, int], c_t: dict[str, int], r_t: int
    ) -> None:
        """
        See @give_feedback, with the single addition of one parameter for the
        Contextual MAB problem:

        Added Parameters:
            c_t (dict[str, int]):
                The map of context variables and their observed values that were
                provided to the contextual_choose method before your agent made its
                decision, e.g., {"Z": 0, "W": 1}

        In this method, c_t is given, which represent pre-action covariates available to
        the agent through which to make more situation-specific choices. In an advertising
        context, these might be attributes like c_t = {"age": 21, "home_state": 31, ...}
        Since these were provided when your agent made its choice, it should remember those
        in some way.

        In other words, this method would behave exactly the same as give_feedback if
        c_t were the empty dictionary, but I've tried having just this method in the past
        and it was too confusing, so here we are!
        """
        # [!] TODO: Change this to record any contextual feedback from each trial!
        actions = tuple(sorted(a_t.items()))
        contexts = tuple(sorted(c_t.items()))
        action_context_combo = actions + contexts

        if action_context_combo in self.contextual_agent_history:
            total_reward, num_chosen = self.contextual_agent_history[
                action_context_combo
            ]
            self.contextual_agent_history[action_context_combo] = (
                total_reward + r_t,
                num_chosen + 1,
            )
        else:
            self.contextual_agent_history[action_context_combo] = (1 + r_t, 3)

    def clear_history(self) -> None:
        """
        Resets your agent's history between simulations.

        [!] No information is allowed to transfer between each of the N
        Monte Carlo repetitions.

        [!] Called by the environment following a Monte Carlo repetition, but you
        MAY also call this method, e.g., during your constructor, or override it
        in subclasses below.
        """
        self._initialize_history((1, 2))

    def choose(self) -> dict[str, int]:
        """
        The choose method is called by the environment when it is time for the agent to
        make a decision, i.e., a choice of values for each decision variable.

        [!] Default behavior for the MABAgent superclass when asked to provide a choice:
        simply chooses at random. Should be overridden in MABAgent subclasses depending
        on the Action Selection Rule being implemented.

        Returns:
            dict[str, int]:
                The decision map representing your agent's choice at the current round,
                e.g., {"X": 0}
        """
        return self._get_random_choice()

    def contextual_choose(self, c_t: dict[str, int]) -> dict[str, int]:
        """
        See @choose, but with the addition of a context mapping to provide the state of
        pre-choice variables c_t that may be relevant to your agent's decision.

        In this method, c_t represents pre-action covariates available to
        the agent through which to make more situation-specific choices. In an advertising
        context, these might be attributes like c_t = {"age": 21, "home_state": 31, ...}

        Added Parameters:
            c_t (dict[str, int]):
                The map of context variables and their observed values that were
                provided to the contextual_choose method before your agent makes its
                decision, e.g., {"Z": 0, "W": 1}
        """
        return self._get_random_choice()

    def _get_random_choice(self) -> dict[str, int]:
        """
        See @choose, this helper will return a random action from amongst those possible.
        """
        return {
            self.dec_vars[ind]: random.randrange(self.dec_cards[ind])
            for ind in range(len(self.dec_vars))
        }

    def _compute_q_value(self, a_t: dict[str, int]) -> float:
        action: tuple[str, int] = self._action_dict_to_tuple(a_t)
        total_reward, num_chosen = self.history[action]
        return total_reward / num_chosen

    def _get_greedy_choice(self) -> dict[str, int]:
        """
        Helper method to get a greedy choice (exploit)
        """
        max_q_value: float = float("-inf")
        best_arms = []

        for action in self.history:
            action_dict: dict[str, int] = self._action_tuple_to_dict(action)
            q_value: float = self._compute_q_value(action_dict)

            if q_value > max_q_value:
                max_q_value = q_value
                best_arms = [action_dict]
            elif q_value == max_q_value:
                best_arms.append(action_dict)

        return random.choice(best_arms)

    def _initialize_history(self, initial_val: tuple[int, int]) -> None:
        self.history: dict[tuple[str, int], tuple[int, int]] = {}
        action: tuple = ()
        
        if len(self.dec_vars) < 2:
            decision: str = self.dec_vars[0]
            for dec_var in range(self.dec_cards[0]):
                action = (decision, dec_var)
                self.history[action] = initial_val
        else:
            for arm in itertools.product(*[range(card) for card in self.dec_cards]):
                action = tuple(zip(self.dec_vars, arm))
                # Convert the action to a tuple of strings and integers
                action_str_int = tuple((str(k), int(v)) for k, v in action)
                # Extract the first element of action_str_int as the key
                key = action_str_int[0]
                self.history[key] = initial_val

    def _action_dict_to_tuple(self, a_t: dict[str, int]) -> tuple[str, int]:
        if len(self.dec_vars) < 2:
            return tuple(a_t.items())[0]
        else:
            return tuple(sorted(a_t.items()))[0]
    
    def _action_tuple_to_dict(self, a_t: tuple[str, int]) -> dict[str, int]:
        if len(self.dec_vars) > 1:
            action_dict = dict([a_t])
        else:
            action_dict = {a_t[0]: a_t[1]}
        return action_dict


# ----------------------------------------------------------------
# MAB Agent Subclasses
# ----------------------------------------------------------------


class GreedyAgent(MABAgent):
    """
    Greedy bandit player that, at every trial, selects the
    arm with the presently-highest Q_t(a) value

    [!] Performs no exploration
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int]):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - The greedy ASR
        """
        return self._get_greedy_choice()


class EpsilonGreedyAgent(MABAgent):
    """
    Exploratory bandit player that makes the greedy choice with
    probability 1-epsilon, and chooses randomly with probability
    epsilon
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int], epsilon: float):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.

        Added Parameters from Superclass:
            epsilon (float):
                The probability that the agent takes an exploratory move rather than
                an exploitative one.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self.epsilon: float = epsilon

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - The epsilon-greedy ASR
        """
        if random.random() < self.epsilon:
            # Explore randomly with probability epsilon
            return self._get_random_choice()
        else:
            # Exploit (choose greedily) with probability 1-epsilon
            return self._get_greedy_choice()


class EpsilonFirstAgent(MABAgent):
    """
    Exploratory bandit player that takes the first epsilon*T
    trials to randomly explore, and thereafter chooses greedily
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int], explore_until_t: int):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.

        Added Parameters from Superclass:
            explore_until_t (int):
                The number of trials that this agent will spend exploring arms randomly
                before selecting arms greedily
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self.explore_until_t: int = explore_until_t
        self.explore_count: int = 0

    def clear_history(self) -> None:
        """
        See @MABAgent.clear_history
        
        This particular subclass overriding of the clear history method to reset explore count value
        """

        super().clear_history()
        self.explore_count = 0

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - The epsilon-first ASR
        """
        if self.explore_count < self.explore_until_t:
            # Explore randomly for the specified number of trials
            self.explore_count += 1
            return self._get_random_choice()
        else:
            # Exploit (choose greedily) thereafter
            return self._get_greedy_choice()


class EpsilonDecreasingAgent(MABAgent):
    """
    Exploratory bandit player that acts like epsilon-greedy but
    with a decreasing value of epsilon over time
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int], decay_rate: float):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.

        Added Parameters from Superclass:
            decay_rate (float):
                The decay rate of this agent's exploration chance, such that after every
                trial, the decay rate decreases by this factor. E.g., a decay_rate of
                0.9 means that a current exploration chance of 0.9 will become 0.81 after
                this trial.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self.decay_rate: float = decay_rate
        self.epsilon: float = 1.0

    def clear_history(self) -> None:
        """
        See @MABAgent.clear_history
        
        This particular subclass overriding of the clear history method to reset epsilon value
        """

        super().clear_history()
        self.epsilon = 1.0

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - The epsilon-decreasing ASR
        """
        if random.random() < self.epsilon:
            self.epsilon *= self.decay_rate
            return self._get_random_choice()
        else:
            self.epsilon *= self.decay_rate
            return self._get_greedy_choice()


class TSAgent(MABAgent):
    """
    Thompson Sampling bandit player that self-adjusts exploration
    vs. exploitation by sampling arm qualities from successes
    summarized by a corresponding beta distribution
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int]):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self._initialize_history((1, 1))

    def clear_history(self) -> None:
        """
        Resets your agent's history between simulations.

        [!] No information is allowed to transfer between each of the N
        Monte Carlo repetitions.

        [!] Called by the environment following a Monte Carlo repetition, but you
        MAY also call this method, e.g., during your constructor, or override it
        in subclasses below.
        """
        self._initialize_history((1, 1))

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - The Thompson Sampling / Bayesian Update Rule ASR
        """

        # Sample from Beta distributions for each arm
        arm_samples: list[float] = []
        for arm in self.history:
            win, lose = self.history[arm]
            samples: float = np.random.beta(win, lose)
            arm_samples.append(samples)

        # Choose the arm with the highest sampled value
        chosen_arm_index = np.argmax(arm_samples)
        chosen_arm: tuple[str, int] = list(self.history.keys())[chosen_arm_index]
        return self._action_tuple_to_dict(chosen_arm)

    def give_feedback(self, a_t: dict[str, int], r_t: int) -> None:
        """
        Update the history to record the pulled arm and its associated outcome.
        """
        action: tuple[str, int] = self._action_dict_to_tuple(a_t)
        win, lose = self.history[action]
        if r_t == 1:
            self.history[action] = (win + 1, lose)
        else:
            self.history[action] = (win, lose + 1)


class CustomAgent(MABAgent):
    """
    Custom agent that manages the explore vs. exploit dilemma via
    your own strategy, or by implementing a strategy you discovered
    that is not amongst those above!
    """

    def __init__(self, dec_vars: list[str], dec_cards: list[int]):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self.c = 0.4
        self.explore_count = 0

    def clear_history(self) -> None:
        self.explore_count = 0
        super().clear_history()

    def _compute_q_value(self, a_t: dict[str, int]) -> float:
        action: tuple[str, int] = self._action_dict_to_tuple(a_t)
        q_value: float = super()._compute_q_value(a_t)
        a_value: float = q_value + self.c * math.sqrt(
            math.log2(self.explore_count) / self.history[action][1]
        )
        return a_value

    def choose(self) -> dict[str, int]:
        """
        See @MABAgent.choose

        This particular subclass overriding of the choose method performs the following:
        - Your own custom MAB agent! OR
        - An implementation of an ASR that is not one of the above
        - Must outperform the Thompson Sampling agent on select unit tests
        """
        # [!] TODO: Implement this agent's ASR and replace its current implementation
        # that simply chooses arms at random
        self.explore_count += 1
        return self._get_greedy_choice()


class ContextualAgent(MABAgent):
    """
    Custom agent that plays the Contextual MAB game, accepting some
    context covariates c_t before each decision.

    [!] Still inherits from MABAgent, but you may wish to override
    parts of the superclass' constructor like the history attribute!
    """

    def __init__(
        self,
        dec_vars: list[str],
        dec_cards: list[int],
        context_vars: list[str],
        context_cards: list[int],
    ):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.

        Added Parameters from Superclass:
            context_vars (list[str]):
                A list of context variables that are available to the agent to make their
                decision at each trial, e.g., ["W", "S"]
            context_cards (list[int]):
                A list of variable cardinalities belonging to each context variable by
                index in which they appear in context_vars.
        """
        MABAgent.__init__(self, dec_vars, dec_cards)
        self.context_vars = context_vars
        self.context_cards = context_cards

        self.action_combos = set()
        for arm in itertools.product(*[range(card) for card in self.dec_cards]):
            action_dict = dict(zip(self.dec_vars, arm))
            for key, value in action_dict.items():
                var = tuple((key, value))
                self.action_combos.add(var)

    def clear_history(self) -> None:
        self.contextual_agent_history = {}

    def contextual_choose(self, c_t: dict[str, int]) -> dict[str, int]:
        """
        See @MABAgent.contextual_choose
        """
        max_prob: float = float("-inf")
        best_arm: tuple 

        sorted_c_t = tuple(sorted(c_t.items()))
        for combo in self.action_combos:
            key_form = (combo,) + sorted_c_t
            if key_form in self.contextual_agent_history:
                numerator, denominator = self.contextual_agent_history[key_form]
                q_t: float = numerator / denominator
                if q_t > max_prob:
                    max_prob = q_t
                    best_arm = combo
            else:
                if 0.5 > max_prob or (0.5 == max_prob and random.random() < 0.5):
                    max_prob = 0.5
                    best_arm = combo

        return {best_arm[0]: best_arm[1]}


class ContextBlindAgent(TSAgent):
    """
    [!] This agent is given as a "control" comparison for the contextual bandit
    problem and thus need/should NOT be modified.
    """

    def __init__(
        self,
        dec_vars: list[str],
        dec_cards: list[int],
        context_vars: list[str],
        context_cards: list[int],
    ):
        """
        See @MABAgent.__init__

        Can be used to initialize any other attributes needed for this agent's ASR.

        Added Parameters from Superclass:
            context_vars (list[str]):
                A list of context variables that are available to the agent to make their
                decision at each trial, e.g., ["W", "S"]
            context_cards (list[int]):
                A list of variable cardinalities belonging to each context variable by
                index in which they appear in context_vars.
        """
        TSAgent.__init__(self, dec_vars, dec_cards)

    def give_contextual_feedback(
        self, a_t: dict[str, int], c_t: dict[str, int], r_t: int
    ) -> None:
        """
        See @MABAgent.give_contextual_feedback
        """
        self.give_feedback(a_t, r_t)
