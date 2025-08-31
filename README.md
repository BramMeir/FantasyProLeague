# Fantasy Pro League Optimizer
This is a personal project that I have been working on for a while. The goal of this project is to create a tool that can help me optimize my Fantasy Pro League team. Using the data from the current season (https://fantasy.proleague.be/stats), this tool makes it possible to compute the best performing team. By using Integer Lineair Programming, it is possible to find the best players that maximize the total points of the team while respecting the given constraints (e.g. budget, number of players per team, etc.).

# How to use
## Main team
By running the `npm run dev:scraper` command inside the `fantasyproleague` directory, you can obtain the necessary data (statistics from the players, current ranking and following matchdays). This data will be stored in JSON format in the `data` folder inside the backend. Running the docker container for the frontend and backend will allow you to access the web interface.

# Future work
- Improve on transfer optimization.
- Use more advanced data to take into account previous seasons, player form, etc.
- Implement a more user-friendly interface to select the constraints and visualize the results.
