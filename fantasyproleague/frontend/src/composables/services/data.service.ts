import { ref, type Ref } from 'vue';
import { endpoints } from '@/config/endpoints.ts';
import { getList } from './helpers.ts';
import { Player } from '@/types/Player.ts';

interface PlayerState {
    player: Ref<Player | null>;
    players: Ref<Player[] | null>;
    getBestPerformingPlayers: (numberOfPlayers: number, position: string) => Promise<void>;
}

export function usePlayer(): PlayerState {
    /* State */
    const player = ref<Player | null>(null);
    const players = ref<Player[]>([]);

    async function getBestPerformingPlayers(numberOfPlayers: number, position: string): Promise<void> {
        const endpoint = endpoints.api.players.bestPerforming.replace('{position}', position).replace('{numberOfPlayers}', numberOfPlayers.toString());
        console.log(endpoint);
        await getList<Player>(endpoint, players, Player.fromJSON);
    }
    
    return {
        player,
        players,
        getBestPerformingPlayers
    };
}