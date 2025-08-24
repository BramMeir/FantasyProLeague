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


def print_best(n, position=None, best_function=best_performance_wise):
    """Print the best players based on their performance/price ratio."""
    if position:
        print(f"Best {n} based on their performance/price ratio (position = {position}):\n")
    else:
        print(f"Best {n} based on their performance/price ratio:\n")

    best_players = best_function(n, position)

    # Print headers for clarity
    print(f"{'Name':<20} {'Points':<20} {'Price':<20} {'Performance/Price Ratio':>25}")
    print("-" * 100)

    for player in best_players:
        # Format the player data with alignment and spacing
        performance_price_ratio = float(player['points']) / float(player['price'])
        print(f"{player['name']:<20} {player['points']:<20} {player['price']:<20} {performance_price_ratio:>25.2f}")


if __name__ == "__main__":
    print_best(20, "Aanvaller", best_performance_wise)
