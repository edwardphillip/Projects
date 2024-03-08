"""
Skeleton for answering queries related to the Ad Agent.

@author: Henry Benso & Edward Halim
"""

from pgmpy.inference import VariableElimination
from pgmpy.models import BayesianNetwork
from ad_agent import AdEngine
from constants import *
import numpy as np
import pandas as pd


class AdAgentQueries:
    """
    See Problem 7 in the Spec for requested answer formats below
    """

    def __init__(self, ad_agent: "AdEngine") -> None:
        self._ad_agent = ad_agent

    def answer_7_1(self) -> float:
        # return -1.0  # TODO! Replace this answer
        return self._ad_agent.vpi(potential_evidence="G", observed_evidence={})

    def answer_7_2(self) -> float:
        # return -1.0  # TODO! Replace this answer
        return self._ad_agent.vpi(potential_evidence="P", observed_evidence={"G": 1})

    def answer_7_3(self) -> dict[str, int]:
        # return {"A": -1}  # TODO! Replace this answer
        return self._ad_agent.most_likely_consumer(evidence={"A": 0, "H": 1})


if __name__ == "__main__":
    """
    Use this main method to run the requested queries for your report
    """
    # Initialize Ad Agent and Query Helper Class
    ad_agent = AdEngine(ADBOT_DATA, ADBOT_STRUC, ADBOT_DEC, ADBOT_UTIL)
    querier = AdAgentQueries(ad_agent)

    print("Answer to 7.1: " + str(querier.answer_7_1()))
    print("Answer to 7.2: " + str(querier.answer_7_2()))
    print("Answer to 7.3: " + str(querier.answer_7_3()))
