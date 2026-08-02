import { ref, type Ref } from 'vue';
import { endpoints } from '@/config/endpoints';
import { getList, postList } from './helpers';
import { Player } from '@/types/Player';

interface PlayerState {
    player: Ref<Player | null>;
    players: Ref<Player[] | null>;
    bestPlayers: Ref<Player[] | null>;
    getAllPlayers: () => Promise<Player[]>;
    getBestPerformingPlayers: (numberOfPlayers: number, position: string) => Promise<Player[]>;
    getBestPriceWisePlayers: (numberOfPlayers: number, position: string) => Promise<Player[]>;
    getBestSelection: (
        budget: number, 
        mustHavePlayers: { name: string; teamShortName: string; }[],
        excludedPlayers: { name: string; teamShortName: string; }[]
    ) => Promise<Player[]>;
}

export function usePlayer(): PlayerState {
    /* State */
    const player = ref<Player | null>(null);
    const players = ref<Player[]>([]);
    const bestPlayers = ref<Player[]>([]);

    async function getAllPlayers(): Promise<Player[]> {
        const endpoint = endpoints.api.players.all;
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    async function getBestPerformingPlayers(numberOfPlayers: number, position: string): Promise<Player[]> {
        const endpoint = endpoints.api.players.bestPerforming.replace('{position}', position).replace('{numberOfPlayers}', numberOfPlayers.toString());
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    async function getBestPriceWisePlayers(numberOfPlayers: number, position: string): Promise<Player[]> {
        const endpoint = endpoints.api.players.bestPriceWise.replace('{position}', position).replace('{numberOfPlayers}', numberOfPlayers.toString());
        return await getList<Player>(endpoint, players, Player.fromJSON);
    }

    async function getBestSelection(
        budget: number, 
        mustHavePlayers: { name: string; teamShortName: string; }[],
        excludedPlayers: { name: string; teamShortName: string; }[]
    ): Promise<Player[]> {
        const endpoint = endpoints.api.team.bestSelection;

        const payload = {
            budget: budget,
            // Convert players to objects that have just the name and teamShortName
            must_have_players: mustHavePlayers.map(player => ({
                name: player.name,
                teamShortName: player.teamShortName
            })),
            excluded_players: excludedPlayers.map(player => ({
                name: player.name,
                teamShortName: player.teamShortName
            }))
        };

        return await postList<Player>(endpoint, payload, bestPlayers, Player.fromJSON);
    }

    return {
        player,
        players,
        bestPlayers,
        getAllPlayers,
        getBestPerformingPlayers,
        getBestPriceWisePlayers,
        getBestSelection
    };
}