'''
Constants to be used across various Ad Agent and Decision Network
tests, including network structure configurations and test file locations.

[!] Feel free to edit this file at will
[!] Note: any data frame in here should not be modified!
'''

import pandas as pd

# Lecture 5-2 Example
# -----------------------------------------------------------------------------------------
LECTURE_5_2_DATA  = pd.read_csv("../dat/lecture5-2-data.csv")
LECTURE_5_2_STRUC = [("M", "C"), ("D", "C")]
LECTURE_5_2_DEC   = ["D"]
LECTURE_5_2_UTIL  = {"C": {0: 3, 1: 1}}

# AdBot Example
# -----------------------------------------------------------------------------------------
ADBOT_DATA  = pd.read_csv("../dat/adbot-data.csv")
# TODO: Correct the Adbot BN Structure here
# (parent, child)
ADBOT_STRUC = [("A", "H"), ("H", "I"), ("A", "T"), ("P", "T"), ("P", "G"), ("A", "F"), ("Ad2", "F"), ("F", "S"), ("Ad1", "G"), ("Ad1", "S"), ("G", "S")]
# TODO: Correct the Adbot decision nodes / vars here
ADBOT_DEC   = ["Ad1", "Ad2"]
# TODO: Correct Adbot utilities here
ADBOT_UTIL  = {"S": {0: 0, 1: 1776, 2: 500}}