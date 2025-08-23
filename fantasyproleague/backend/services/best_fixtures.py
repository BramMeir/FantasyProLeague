"""This module contains the logic to predict the team that will perform the best in the next weeks,
based on the current performance of the players and the next fixtures."""
from functions.help_functions import get_data

# Variable that contains the current gameweek
CURRENT_GAMEWEEK = 24


def compute_predicted_performance(team):
    """Compute the predicted performance of a team based on the next fixtures."""
    # Get the players from the data/players.json file
    players = get_data("../data/players.json")

    # Get the teams
    teams = set(player["team"] for player in players)

    # Compute the quality of the teams based on the players
    team_qualities = {team: sum(float(player["points"]) for player in players
                                if player["team"] == team) for team in teams}

    # Get the next fixtures from the data/fixtures.json file
    fixtures = get_data("../data/fixtures.json")

    # Initialize the predicted performance
    predicted_performance = 0

    # Weight factor that decreases the importance of the next fixtures
    weight_factor = 0.9

    # Compute the predicted performance based on the next fixtures
    for fixture in fixtures:
        for match in fixture["matches"]:
            if match["home"] == team:
                predicted_performance += compute_predicted_performance_for_fixture(
                    team, match["away"], team_qualities, home=True
                ) * weight_factor
            elif match["away"] == team:
                predicted_performance += compute_predicted_performance_for_fixture(
                    team, match["home"], team_qualities, home=False
                ) * weight_factor

        weight_factor *= 0.9

    return predicted_performance


def compute_predicted_performance_for_fixture(team, opponent_team_name, team_qualities, home=True):
    """Compute the predicted performance of a team for a specific fixture."""
    # Compute the base performance of the team
    predicted_performance = (team_qualities[team]) / (CURRENT_GAMEWEEK - 1)

    # Compute the base performance of the opponent team
    predicted_opponent_performance = (team_qualities[opponent_team_name]) / (CURRENT_GAMEWEEK - 1)

    # Adjust the predicted performance based on the home/away factor
    if home:
        predicted_performance *= 1.1
    else:
        predicted_performance *= 0.9

    # Adjust the predicted performance based on the opponent ranking
    predicted_performance -= predicted_opponent_performance

    return predicted_performance


def print_teams():
    """Print the teams based on their predicted performance."""
    # Get the players from the data/players.json file
    players = get_data("../data/players.json")

    # Get the teams
    teams = set(player["team"] for player in players)

    # Compute the predicted performance of the teams
    predicted_performances = {team: compute_predicted_performance(team) for team in teams}

    # Sort the teams based on their predicted performance
    sorted_teams = sorted(teams, key=lambda x: predicted_performances[x], reverse=True)

    # Print the teams based on their predicted performance
    print("Teams based on their predicted performance:\n")
    print(f"{'Team':<20} {'Predicted Performance':>25}")
    print("-" * 50)

    for team in sorted_teams:
        print(f"{team:<20} {predicted_performances[team]:>25.2f}")


if __name__ == "__main__":
    print_teams()
