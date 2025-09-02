<script setup lang="ts">
import PlayerDataTable from '@/components/PlayerDataTable.vue';
import { usePlayer } from '@/composables/services/data.service';
import { Player } from '@/types/Player';
import Column from 'primevue/column';
import BaseLayout from '@/views/layout/BaseLayout.vue';

const { players, getBestPriceWisePlayers } = usePlayer();

// Create a wrapper function to handle fetching AND data transformation
const fetchAndTransformPriceWisePlayers = async (count: number, pos: string) => {
  await getBestPriceWisePlayers(count, pos);
  
  // Add the computed field after fetching
  players.value = players.value.map((player: Player) => ({
    ...player,
    points_per_million: player.price > 0 
        ? (player.points / player.price).toFixed(2)
        : 0
  }));
};
</script>

<template>
    <BaseLayout>
      <PlayerDataTable
        title="Spelers met hoogste 'Points per million' ratio"
        :fetch-player-data="fetchAndTransformPriceWisePlayers"
        :players="players"
      >
        <template #extra-columns>
          <Column field="points_per_million" header="Punten per Miljoen" sortable>
            <template #body="slotProps">
              <strong>{{ slotProps.data.points_per_million }}</strong>
            </template>
          </Column>
        </template>
      </PlayerDataTable>
    </BaseLayout>
</template>