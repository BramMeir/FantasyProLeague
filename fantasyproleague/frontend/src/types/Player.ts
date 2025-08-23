export interface PlayerJSON {
    name: string;
    team: string;
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
            player.position,
            player.points,
            player.price,
            player.goals,
            player.assists,
        );
    }
}
