export interface PlayerJSON {
    name: string;
    team: string;
    teamShortName: string;
    position: string;
    points: number;
    price: number;
    goals: number;
    assists: number;
}

// Player class similar to the one used in the backend
export class Player {
    constructor(
        public name: string = "",
        public team: string = "",
        public teamShortName: string = "",
        public position: string = "",
        public points: number = 0,
        public price: number = 0,
        public goals: number = 0,
        public assists: number = 0,
    ) {}

    /**
     * Convert a player object to a player instance.
     *
     * @param player
     */
    static fromJSON(player: PlayerJSON): Player {
        return new Player(
            player.name,
            player.team,
            player.teamShortName,
            player.position,
            parseFloat(String(player.points)) || 0,
            parseFloat(String(player.price)) || 0,
            parseInt(String(player.goals), 10) || 0,
            parseInt(String(player.assists), 10) || 0,
        );
    }
}
