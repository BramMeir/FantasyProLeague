# Fantasy Pro League Optimizer
This is a personal project that I have been working on for a while. The goal of this project is to create a tool that can help me optimize my Fantasy Pro League team. Using the data from the current season (https://fantasy.proleague.be/stats), this tool makes it possible to compute the best performing team. By using Integer Lineair Programming, it is possible to find the best players that maximize the total points of the team while respecting the given constraints (e.g. budget, number of players per team, etc.).

# How to use
## Main team
By running the JavaScript files in the `help` folder, you can obtain the necessary data (statistics from the players, current ranking and following matchdays). This data will be stored in JSON format in the `data` folder. The main `build_team.py` file will then use this data to compute the best team.

## Transfers
The `best_transfer.py` file will compute the best transfer(s) to make in order to improve the team, based on the performance of players and the next matchdays of their teams.

# Future work
- Improve on transfer optimization.
- Use more advanced data to take into account previous seasons, player form, etc.
- Implement a more user-friendly interface to select the constraints and visualize the results.
