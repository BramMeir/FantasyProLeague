from fastapi import FastAPI
from services.best_eleven import best_price_wise, best_performance_wise

app = FastAPI()


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
