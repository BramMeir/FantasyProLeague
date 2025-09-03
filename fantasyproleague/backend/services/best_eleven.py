"""This module contains the logic to select the best players."""
from functions.help_functions import get_data

positions = ["aanvaller", "middenvelder", "verdediger", "doelman"]


def best_price_wise(n, position=None):
    """Return the best n players based on their performance/price ratio."""
    # Get the players from the data/players.json file
    players = get_data("players.json")

    # Sort the players based on their performance/price ratio
    sorted_players = sorted(players, key=lambda x: float(x["points"]) / float(x["price"]),
                            reverse=True)

    # Return the best n players based on the position
    if position and position.lower() in positions:
        return [player for player in sorted_players if player["position"].lower() == position.lower()][:n]

    # No position specified, return the best n players
    return sorted_players[:n]


def best_performance_wise(n, position=None):
    """Return the best n players based on their performance."""
    # Get the players from the data/players.json file
    players = get_data("../data/players.json")

    # Sort the players based on their performance
    sorted_players = sorted(players, key=lambda x: float(x["points"]), reverse=True)

    # Return the best n players based on the position
    if position and position.lower() in positions:
        return [player for player in sorted_players if player["position"].lower() == position.lower()][:n]

    # No position specified, return the best n players
    return sorted_players[:n]


def all_players():
    """Return all players."""
    return get_data("../data/players.json")
