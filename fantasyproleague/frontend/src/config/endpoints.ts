export const endpoints = {
    api: {
        players: {
            bestPerforming: 'http://localhost:8000/players/best-performance?position={position}&number_of_players={numberOfPlayers}',
            bestPriceWise: 'http://localhost:8000/players/best-price?position={position}&number_of_players={numberOfPlayers}',
        }
    }

};