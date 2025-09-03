from pulp import LpMaximize, LpProblem, LpVariable, lpSum
from functions.help_functions import get_data


def best_selection(budget=100, must_have_players=None):
    """
    Build the best team of 15 players within the given budget,
    ensuring that a pre-selected list of players is included.

    Args:
        budget (int): The total budget for the team.
        must_have_players (list): A list of player dictionaries that must be in the final team.
    """
    if must_have_players is None:
        must_have_players = []

    # Get players from the dataset
    players = get_data("players.json")

    # Define the ILP problem
    problem = LpProblem("Best_Team", LpMaximize)

    # We create a unique name for each variable like "player_0", "player_1", etc.
    # and store them in a list.
    player_vars = [LpVariable(f"player_{i}", cat="Binary") for i, p in enumerate(players)]

    # For efficient lookup, create a set of unique identifiers for the must-have players.
    # We use a tuple of (name, team) as a unique key for each player.
    must_have_set = {(p['name'], p['teamShortName']) for p in must_have_players}

    # Add constraints to force the selection of these players
    for i, p in enumerate(players):
        if (p['name'], p['teamShortName']) in must_have_set:
            problem += player_vars[i] == 1, f"Force_select_{p['name']}"

    # Objective function: Maximize total points
    problem += lpSum(player_vars[i] * float(p["points"]) for i, p in enumerate(players))

    # Constraint: Budget limit
    problem += lpSum(player_vars[i] * float(p["price"]) for i, p in enumerate(players)) <= budget

    # Constraint: Select exactly 15 players
    problem += lpSum(player_vars[i] for i, p in enumerate(players)) == 15

    # Constraint: Max 3 players per team
    teams = set(p["team"] for p in players)
    for team in teams:
        problem += lpSum(player_vars[i] for i, p in enumerate(players) if p["team"] == team) <= 3

    # Positional constraints
    position_limits = {"Doelman": 2, "Verdediger": 5, "Middenvelder": 5, "Aanvaller": 3}
    for pos, limit in position_limits.items():
        problem += lpSum(player_vars[i] for i, p in enumerate(players) if p["position"] == pos) == limit

    # Solve the ILP problem
    problem.solve()

    selected_team = [p for i, p in enumerate(players) if player_vars[i].varValue == 1]

    return selected_team
