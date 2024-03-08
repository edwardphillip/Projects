import time
import random
import math
from queue import Queue
from constants import *
from maze_clause import *
from maze_knowledge_base import *


class MazeAgent:
    """
    BlindBot MazeAgent meant to employ Propositional Logic,
    Planning, and Active Learning to navigate the Pitsweeper
    Problem. Have fun!
    """

    def __init__(self, env: "Environment", perception: dict) -> None:
        """
        Initializes the MazeAgent with any attributes it will need to
        navigate the maze.
        [!] Add as many attributes as you see fit!

        Parameters:
            env (Environment):
                The Environment in which the agent is operating; make sure
                to see the spec / Environment class for public methods that
                your agent will use to solve the maze!
            perception (dict):
                The starting perception of the agent, which is a
                small dictionary with keys:
                  - loc:  the location of the agent as a (c,r) tuple
                  - tile: the type of tile the agent is currently standing upon
        """
        self.env: "Environment" = env
        self.goal: tuple[int, int] = env.get_goal_loc()

        # The agent's maze can be manipulated as a tracking mechanic
        # for what it has learned; changes to this maze will be drawn
        # by the environment and is simply for visuals / debugging
        # [!] Feel free to change self.maze at will
        self.maze: list = env.get_agent_maze()

        # Standard set of attributes you'll want to maintain
        self.kb: "MazeKnowledgeBase" = MazeKnowledgeBase()
        self.possible_pits: set[tuple[int, int]] = set()
        self.safe_tiles: set[tuple[int, int]] = set()
        self.pit_tiles: set[tuple[int, int]] = set()

        self.start: tuple[int, int] = env.get_player_loc()
        self.safe_tiles.add(self.start)
        self.encountered_possible_pits = 0

        # [!] TODO: Initialize any other knowledge-related attributes for
        # agent here, or any other record-keeping attributes you'd like

        # ----------------------------------------------------------------
        self.safe_tiles.add(self.goal)
        start_adjacent_safe_tiles = env.get_cardinal_locs(self.start, 1)
        for tile in start_adjacent_safe_tiles:
            self.safe_tiles.add(tile)

    ##################################################################
    # Methods
    ##################################################################

    def update_kb(self, loc: tuple[int, int], tile_type: str) -> None:
        """
        Update the agent's knowledge base based on the perception.
        """
        surrounding_locs = self.env.get_cardinal_locs(loc, 1)

        if tile_type == Constants.SAFE_BLOCK:
            clauses = []
            for spot in surrounding_locs:
                self.safe_tiles.add(spot)
                clauses.append(((Constants.PIT_BLOCK, spot), False))
            maze_clause = MazeClause(clauses)
            if not maze_clause.is_valid():
                self.kb.tell(maze_clause)

        elif tile_type == Constants.WRN_THREE_BLOCK:
            clauses = []
            for spot in surrounding_locs:
                if spot in self.env.get_explored_locs():
                    clauses.append(((Constants.PIT_BLOCK, spot), False))
                else:
                    clauses.append(((Constants.PIT_BLOCK, spot), True))
                    self.maze[spot[1]][spot[0]] = Constants.PIT_BLOCK
                    self.pit_tiles.add(spot)
            maze_clause = MazeClause(clauses)
            if not maze_clause.is_valid():
                self.kb.tell(maze_clause)

        elif tile_type == Constants.WRN_TWO_BLOCK:
            true_clauses = []
            false_clauses = []
            for spot in surrounding_locs:
                for _ in surrounding_locs:
                    if spot != _ and spot not in self.env.get_explored_locs():
                        true_clauses.append(((Constants.PIT_BLOCK, spot), True))
                        true_clauses.append(((Constants.PIT_BLOCK, _), True))
                        maze_clause = MazeClause(true_clauses)
                        if not maze_clause.is_valid():
                            self.kb.tell(maze_clause)
                        true_clauses = []
                false_clauses.append(((Constants.PIT_BLOCK, spot), False))

            maze_false_clauses = MazeClause(false_clauses)
            if not maze_false_clauses.is_valid():
                self.kb.tell(maze_false_clauses)

        elif tile_type == Constants.WRN_ONE_BLOCK:
            true_clauses = []
            false_clauses = []
            for spot in surrounding_locs:
                for _ in surrounding_locs:
                    if spot != _ and spot not in self.env.get_explored_locs():
                        false_clauses.append(((Constants.PIT_BLOCK, spot), False))
                        false_clauses.append(((Constants.PIT_BLOCK, _), False))
                        maze_clause = MazeClause(false_clauses)
                        if not maze_clause.is_valid():
                            self.kb.tell(maze_clause)
                        false_clauses = []
                true_clauses.append(((Constants.PIT_BLOCK, spot), True))

            maze_true_clauses = MazeClause(true_clauses)
            if not maze_true_clauses.is_valid():
                self.kb.tell(maze_true_clauses)

        for x in self.pit_tiles:
            if x in self.possible_pits:
                self.possible_pits.remove(x)

        for x in self.safe_tiles:
            if x in self.possible_pits:
                self.possible_pits.remove(x)

    def think(self, perception: dict) -> tuple[int, int]:
        """
        The main workhorse method of how your agent will process new information
        and use that to make deductions and decisions. In gist, it should follow
        this outline of steps:
        1. Process the given perception, i.e., the new location it is in and the
           type of tile on which it's currently standing (e.g., a safe tile, or
           warning tile like "1" or "2")
        2. Update the knowledge base and record-keeping of where known pits and
           safe tiles are located, as well as locations of possible pits.
        3. Query the knowledge base to see if any locations that possibly contain
           pits can be deduced as safe or not.
        4. Use all of the above to prioritize the next location along the frontier
           to move to next.

        Parameters:
            perception (dict):
                A dictionary providing the agent's current location
                and current tile type being stood upon, of the format:
                {"loc": (x, y), "tile": tile_type}

        Returns:
            tuple[int, int]:
                The maze location along the frontier that your agent will try to
                move into next.
        """
        loc: tuple[int, int] = perception["loc"]
        tile_type = perception["tile"]
        self.safe_tiles.add(loc)

        self.update_kb(loc, tile_type)

        for location in self.possible_pits:
            if self.kb.ask(MazeClause([((Constants.PIT_BLOCK, location), True)])):
                self.pit_tiles.add(location)
            elif self.kb.ask(MazeClause([((Constants.PIT_BLOCK, location), False)])):
                self.safe_tiles.add(location)

        frontier = self.env.get_frontier_locs()
        pruned_frontier = set()
        risk_frontier = set()

        for location in frontier:
            if location in self.safe_tiles:
                pruned_frontier.add(location)
            elif location in self.possible_pits and location not in self.pit_tiles:
                risk_frontier.add(location)

        if len(pruned_frontier) != 0:
            return random.choice(list(pruned_frontier))
        elif len(risk_frontier) != 0:
            return random.choice(list(risk_frontier))

        return random.choice(list(frontier))

    def is_safe_tile(self, loc: tuple[int, int]) -> Optional[bool]:
        """
        Determines whether or not the given maze location can be concluded as
        safe (i.e., not containing a pit), following the steps:
        1. Check to see if the location is already a known pit or safe tile,
           responding accordingly
        2. If not, performs the necessary queries on the knowledge base in an
           attempt to deduce its safety

        Parameters:
            loc (tuple[int, int]):
                The maze location in question

        Returns:
            One of three return values:
            1. True if the location is certainly safe (i.e., not pit)
            2. False if the location is certainly dangerous (i.e., pit)
            3. None if the safety of the location cannot be currently determined
        """

        if loc in self.safe_tiles:
            return True

        if loc in self.pit_tiles:
            return False

        check_if_not_pit = self.kb.ask(
            MazeClause([((Constants.PIT_BLOCK, loc), False)])
        )
        check_if_pit = self.kb.ask(MazeClause([((Constants.PIT_BLOCK, loc), True)]))

        if check_if_pit:
            return False
        if check_if_not_pit:
            return True
        return None


# Declared here to avoid circular dependency
from environment import Environment
