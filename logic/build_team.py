"""Module for building the best team using a given budget."""
from logic.best_eleven import get_players


def build_best_15(budget):
    """Build the best team using a given budget."""
    # Get the players from the data/players.json file
    players = get_players()

    # Sort the players based on their performance/price ratio
    sorted_players = sorted(players, key=lambda x: float(x["points"]) / float(x["price"]),
                            reverse=True)

    # Initialize the team and budget
    team = []
    remaining_budget = budget

    # The team should have 15 players
    nr_of_players = 15
    nr_of_goalkeepers = 2
    nr_of_defenders = 5
    nr_of_midfielders = 5
    nr_of_forwards = 3

    return team
