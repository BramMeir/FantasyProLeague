from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.best_eleven import best_price_wise, best_performance_wise, all_players
from services.best_selection import best_selection
from pydantic import BaseModel, Field
from typing import List

app = FastAPI()

# Allow your frontend origin
origins = [
    "http://localhost:5173",  # local dev
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Player(BaseModel):
    '''
    This model represents a single player object in the list
    It only needs the fields required by the best_selection function to identify a player
    '''
    name: str
    teamShortName: str


class SelectionRequest(BaseModel):
    '''
    This model represents the entire JSON body of the request
    '''
    budget: float = 100.0
    # The list of players is optional and will default to an empty list
    must_have_players: List[Player] = Field(default_factory=list)


@app.get("/players")
def get_players():
    '''
    Get all players.
    '''
    return all_players()


@app.get("/players/best-price")
def get_best_price_wise(number_of_players: int = 10, position: str | None = None):
    '''
    Get the best players based on their price/quality ratio.
    '''
    return best_price_wise(number_of_players, position)


@app.get("/players/best-performance")
def get_best_performance_wise(number_of_players: int = 10, position: str | None = None):
    '''
    Get the best players based on their performance.
    '''
    return best_performance_wise(number_of_players, position)


@app.post("/team/best-selection")
def get_best_selection(request: SelectionRequest):
    '''
    Get the best team of players based on a budget and an optional list
    of players that must be included in the team.
    '''
    # Pydantic models need to be converted to dictionaries before passing them
    # to your service function.
    must_have_dicts = [player.model_dump() for player in request.must_have_players]

    return best_selection(
        budget=request.budget,
        must_have_players=must_have_dicts
    )
