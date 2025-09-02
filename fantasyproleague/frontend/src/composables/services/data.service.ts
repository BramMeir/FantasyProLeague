import { ref, type Ref } from 'vue';
import { endpoints } from '@/config/endpoints.ts';
import { getList } from './helpers.ts';
import { Player } from '@/types/Player.ts';

interface PlayerState {
    player: Ref<Player | null>;
    players: Ref<Player[] | null>;
    getBestPerformingPlayers: (numberOfPlayers: number, position: string) => Promise<Player[]>;
    getBestPriceWisePlayers: (numberOfPlayers: number, position: string) => Promise<Player[]>;
    getBestSelection: () => Promise<Player[]>;
}

export function usePlayer(): PlayerState {
    /* State */
    const player = ref<Player | null>(null);
    const players = ref<Player[]>([]);

    async function getBestPerformingPlayers(numberOfPlayers: number, position: string): Promise<Player[]> {
        const endpoint = endpoints.api.players.bestPerforming.replace('{position}', position).replace('{numberOfPlayers}', numberOfPlayers.toString());
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    async function getBestPriceWisePlayers(numberOfPlayers: number, position: string): Promise<Player[]> {
        const endpoint = endpoints.api.players.bestPriceWise.replace('{position}', position).replace('{numberOfPlayers}', numberOfPlayers.toString());
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    async function getBestSelection(): Promise<Player[]> {
        const endpoint = endpoints.api.team.bestSelection;
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    return {
        player,
        players,
        getBestPerformingPlayers,
        getBestPriceWisePlayers,
        getBestSelection
    };
}