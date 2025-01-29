"""Module for building the best team using a given budget."""
from pulp import LpMaximize, LpProblem, LpVariable, lpSum
from logic.best_eleven import get_players


def build_best_15(budget=100):
    """Build the best team of 15 players within the given budget."""
    # Get players from the dataset
    players = get_players("data/players.json")

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


if __name__ == "__main__":
    best_team = build_best_15()
    print("Best team of 15 players within the budget:")

    # Print headers for clarity
    print(f"{'Name':<20} {'Team':<20} {'Points':<20} {'Price':<20}")
    print("-" * 100)

    for player in best_team:
        # Format the player data with alignment and spacing
        print(f"{player['name']:<20} {player['team']:<20} {player['points']:<20} {player['price']:<20}")

    print("\nTotal points:", sum(float(player['points']) for player in best_team))
    print("Total price:", sum(float(player['price']) for player in best_team))
