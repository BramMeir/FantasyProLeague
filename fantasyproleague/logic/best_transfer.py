"""This module contains the logic to predict the player that will perform the best in the next weeks,
based on the current performance of the players and the next fixtures."""
from fetch_data.help_functions import get_data

# Variable that contains the current gameweek
CURRENT_GAMEWEEK = 24


def best_transfer(n, position=None):
    """Return the best n players based on their predicted performance."""
    # Get the players from the data/players.json file
    players = get_data("../data/players.json")

    # Get the next fixtures from the data/fixtures.json file
    fixtures = get_data("../data/fixtures.json")

    # Get the current ranking of the teams
    ranking = get_data("../data/ranking.json")

    # Sort the players based on their predicted performance
    sorted_players = sorted(players, key=lambda x: compute_predicted_performance(x, fixtures, ranking), reverse=True)

    # Return the best n players based on the position
    if position:
        return [player for player in sorted_players if player["position"] == position][:n]

    # No position specified, return the best n players
    return sorted_players[:n]


def compute_predicted_performance(player, fixtures, ranking):
    """Compute the predicted performance of a player based on the next fixtures."""
    # Initialize the predicted performance
    predicted_performance = 0

    # Weight factor that decreases the importance of the next fixtures
    weight_factor = 0.9

    # Compute the predicted performance based on the next fixtures
    for fixture in fixtures:
        for match in fixture["matches"]:
            if match["home"] == player["team"]:
                predicted_performance += compute_predicted_performance_for_fixture(
                    player, match["away"], ranking, home=True
                ) * weight_factor
            elif match["away"] == player["team"]:
                predicted_performance += compute_predicted_performance_for_fixture(
                    player, match["home"], ranking, home=False
                ) * weight_factor

        weight_factor *= 0.9

    return predicted_performance


def compute_predicted_performance_for_fixture(player, opponent_team_name, ranking, home=True):
    """Compute the predicted performance of a player for a specific fixture."""
    # Get the information about the own team
    # own_team = next(team for team in ranking if team["name"] == player["team"])

    # Get the information about the opponent team
    opponent_team = next(team for team in ranking if team["name"] == opponent_team_name)

    # Compute the base performance of the player
    predicted_performance = float(player["points"]) / (CURRENT_GAMEWEEK - 1)

    # Adjust the predicted performance based on the home/away factor
    if home:
        predicted_performance *= 1.2
    else:
        predicted_performance *= 0.8

    # Multiplicator for the opponent ranking
    ranking_multiplicator = [0.7, 0.7, 0.8, 0.8, 0.9, 0.9, 1, 1, 1.1, 1.1, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4]

    # Adjust the predicted performance based on the opponent ranking
    predicted_performance *= ranking_multiplicator[int(opponent_team["rank"]) - 1]

    return predicted_performance


def print_best_transfer(n, position=None):
    """Print the best players based on their predicted performance."""
    if position:
        print(f"Best {n} based on their predicted performance (position = {position}):\n")
    else:
        print(f"Best {n} based on their predicted performance:\n")

    best_players = best_transfer(n, position)

    # Print headers for clarity
    print(f"{'Name':<20} {'Points':<20} {'Team':<20} {'Predicted Performance':>25}")
    print("-" * 100)

    for player in best_players:
        # Format the player data with alignment and spacing
        predicted_performance = compute_predicted_performance(player, get_data("../data/fixtures.json"),
                                                              get_data("../data/ranking.json"))
        print(f"{player['name']:<20} {player['points']:<20} {player['team']:<20} {predicted_performance:>25.2f}")


if __name__ == "__main__":
    print_best_transfer(20)
