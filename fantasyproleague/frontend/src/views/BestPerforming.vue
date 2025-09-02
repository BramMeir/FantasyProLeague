<script setup lang="ts">
import { usePlayer } from '@/composables/services/data.service.ts';
import BaseLayout from '@/views/layout/BaseLayout.vue';
import PlayerDataTable from '@/components/PlayerDataTable.vue';

/* Composables */
const { players, getBestPerformingPlayers } = usePlayer();

</script>

<template>
  <BaseLayout>
    <PlayerDataTable
      title="Best presterende spelers"
      :fetch-player-data="getBestPerformingPlayers"
      :players="players"
    />
  </BaseLayout>
</template>

<style scoped>
</style>