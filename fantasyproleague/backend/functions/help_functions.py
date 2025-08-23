"""Module with help functions for the logic module."""
import json
import os


def get_data(filename: str):
    '''
    Return the data from the given JSON file in the data directory.
    This is done by resolving the path relative to this file’s directory.
    '''
    base_dir = os.path.dirname(__file__)
    file_path = os.path.join(base_dir, "..", "data", filename)
    file_path = os.path.abspath(file_path)

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)
