from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.best_eleven import best_price_wise, best_performance_wise

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
