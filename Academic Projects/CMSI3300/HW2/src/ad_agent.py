"""
ad_engine.py
Advertisement Selection Engine that employs a Decision Network
to Maximize Expected Utility associated with different Decision
variables in a stochastic reasoning environment.

Solution Amended from Legendary N2A Team
> Warning: not a great amendment: was just playing with some
  settings to get the new pgmpy library working
"""
import math
import itertools
import unittest
import numpy as np
import pandas as pd
from pgmpy.inference import VariableElimination
from pgmpy.models import BayesianNetwork


class AdEngine:
    def __init__(
        self,
        data: "pd.DataFrame",
        structure: list[tuple[str, str]],
        dec_vars: list[str],
        util_map: dict[str, dict[int, int]],
    ):
        """
        Responsible for initializing the Decision Network of the
        AdEngine by taking in the dataset, structure of network,
        any decision variables, and a map of utilities

        Parameters:
            data (pd.DataFrame):
                Pandas data frame containing all data on which the decision
                network's chance-node parameters are to be learned
            structure (list[tuple[str, str]]):
                The Bayesian Network's structure, a list of tuples denoting
                the edge directions where each tuple is (parent, child)
            dec_vars (list[str]):
                list of string names of variables to be
                considered decision variables for the agent. Example:
                ["Ad1", "Ad2"]
            util_map (dict[str, dict[int, int]]):
                Discrete, tabular, utility map whose keys
                are variables in network that are parents of a utility node, and
                values are dictionaries mapping that variable's values to a utility
                score, for example:
                  {
                    "X": {0: 20, 1: -10}
                  }
                represents a utility node with single parent X whose value of 0
                has a utility score of 20, and value 1 has a utility score of -10
        """
        self.model = BayesianNetwork(structure)
        self.model.fit(data)
        self.inference = VariableElimination(self.model)
        self.dec_vars = set(dec_vars)
        self.dec_vars_values = dict()
        for label, content in data.items():
            new_set = set()
            for num in content:
                new_set.add(num)
            self.dec_vars_values[label] = new_set
        self.chance_vars = list(util_map.keys())
        self.util_map = util_map
        return

    def meu(self, evidence: dict[str, int]) -> tuple[dict[str, int], float]:
        """
        Computes the Maximum Expected Utility (MEU) defined as the choice of
        decision variable values that maximize expected utility of any evaluated
        chance nodes given in the agent's utility map.

        Parameters:
            evidence (dict[str, int]):
                dict mapping network variables to their observed values,
                of the format: {"Obs1": val1, "Obs2": val2, ...}

        Returns:
            tuple[dict[str, int], float]:
                A 2-tuple of the format (a*, MEU) where:
                [0] is a dictionary mapping decision variables to their MEU states
                [1] is the MEU value (a float) of that decision combo
        """
        chance_vars_copy = self.chance_vars.copy()
        dec_vars_values = self.dec_vars_values.copy()
        for x in evidence.keys():
            if x in chance_vars_copy:
                chance_vars_copy.remove(x)
        for x in frozenset(dec_vars_values.keys()):
            if x not in self.dec_vars:
                del dec_vars_values[x]
        best_decisions, best_util = dict(), -math.inf
        keys, values = zip(*dec_vars_values.items())
        combinations: list[dict[str, int]] = [
            dict(zip(keys, v)) for v in itertools.product(*values)
        ]
        for c in combinations:
            givens = evidence.copy()
            givens.update(c)
            exp_util = self.eu(givens, chance_vars_copy)
            if exp_util > best_util:
                best_decisions = c
                best_util = exp_util

        return (best_decisions, best_util)

    def eu(self, given_evidence: dict[str, int], chance_nodes: list[str]) -> float:
        max_num = -math.inf
        for chance_node in chance_nodes:
            query = self.inference.query([chance_node], given_evidence)
            utility_dict = self.util_map[chance_node]
            total_utility = 0
            for i in range(0, len(query.values)):
                total_utility += query.values[i] * utility_dict[i]
            max_num = max(max_num, total_utility)

        return max_num

    def vpi(self, potential_evidence: str, observed_evidence: dict[str, int]) -> float:
        """
        Given some observed demographic "evidence" about a potential
        consumer, returns the Value of Perfect Information (VPI)
        that would be received on the given "potential" evidence about
        that consumer.

        Parameters:
            potential_evidence (str):
                string representing the variable name of the variable
                under consideration for potentially being obtained
            observed_evidence (tuple[dict[str, int], float]):
                dict mapping network variables
                to their observed values, of the format:
                {"Obs1": val1, "Obs2": val2, ...}

        Returns:
            float:
                float value indicating the VPI(potential | observed)
        """
        _, meu_with_evidence = self.meu(observed_evidence)
        meu_with_potential_evidence = 0
        query_potential_evidence = self.inference.query(
            [potential_evidence], observed_evidence
        )
        for i, key in enumerate(
            query_potential_evidence.state_names[potential_evidence]
        ):
            observed_evidence_copy = observed_evidence.copy()
            observed_evidence_copy[potential_evidence] = key
            _, meu = self.meu(observed_evidence_copy)
            meu_with_potential_evidence += query_potential_evidence.values[i] * meu

        vpi = meu_with_potential_evidence - meu_with_evidence
        if vpi < 0:
            return 0

        return vpi

    def most_likely_consumer(self, evidence: dict[str, int]) -> dict[str, int]:
        """
        Given some known traits about a particular consumer, makes the best guess
        of the values of any remaining hidden variables and returns the completed
        data point as a dictionary of variables mapped to their most likely values.
        (Observed evidence will always have the same values in the output).

        Parameters:
            evidence (dict[str, int]):
                dict mapping network variables
                to their observed values, of the format:
                {"Obs1": val1, "Obs2": val2, ...}

        Returns:
            dict[str, int]:
                The most likely values of all variables given what's already
                known about the consumer.
        """
        all_vars = set(self.model.nodes())
        observed_vars = set(evidence.keys())
        decision_vars = set(self.dec_vars)
        hidden_vars = list(all_vars - observed_vars - decision_vars)
        most_likely_values: dict[str, int] = self.inference.map_query(
            variables=hidden_vars, evidence=evidence
        )

        most_likely_values.update(evidence)
        return most_likely_values
