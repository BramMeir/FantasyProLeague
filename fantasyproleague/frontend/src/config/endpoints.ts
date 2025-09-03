export const endpoints = {
    api: {
        players: {
            all: 'http://localhost:8000/players',
            bestPerforming: 'http://localhost:8000/players/best-performance?position={position}&number_of_players={numberOfPlayers}',
            bestPriceWise: 'http://localhost:8000/players/best-price?position={position}&number_of_players={numberOfPlayers}',
        },
        team: {
            bestSelection: 'http://localhost:8000/team/best-selection',
        }
    }

};