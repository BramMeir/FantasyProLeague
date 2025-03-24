"""Module with help functions for the logic module."""
import json


def get_data(filename):
    """Return the players from the given JSON file."""
    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)
