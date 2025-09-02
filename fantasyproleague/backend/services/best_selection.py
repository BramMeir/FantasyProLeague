from pulp import LpMaximize, LpProblem, LpVariable, lpSum
from functions.help_functions import get_data


def best_selection(budget=100):
    """Build the best team of 15 players within the given budget."""
    # Get players from the dataset
    players = get_data("players.json")

    # Define the ILP problem
    problem = LpProblem("Best_Team", LpMaximize)

    # Define decision variables
    player_vars = {p["name"]: LpVariable(p["name"], cat="Binary") for p in players}

    # Objective function: Maximize total points
    problem += lpSum(player_vars[p["name"]] * float(p["points"]) for p in players)

    # Constraint: Budget limit
    problem += lpSum(player_vars[p["name"]] * float(p["price"]) for p in players) <= budget

    # Constraint: Select exactly 15 players
    problem += lpSum(player_vars[p["name"]] for p in players) == 15

    # Constraint: Max 3 players per team
    teams = set(p["team"] for p in players)
    for team in teams:
        problem += lpSum(player_vars[p["name"]] for p in players if p["team"] == team) <= 3

    # Positional constraints
    position_limits = {"Doelman": 2, "Verdediger": 5, "Middenvelder": 5, "Aanvaller": 3}
    for pos, limit in position_limits.items():
        problem += lpSum(player_vars[p["name"]] for p in players if p["position"] == pos) == limit

    # Solve the ILP problem
    problem.solve()

    # Extract the selected team
    selected_team = [p for p in players if player_vars[p["name"]].varValue == 1]
    return selected_team
