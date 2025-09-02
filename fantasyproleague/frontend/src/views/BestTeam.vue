<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseLayout from '@/views/layout/BaseLayout.vue';
import PlayerCard from '@/components/PlayerCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { Player } from '@/types/Player';
import { usePlayer } from '@/composables/services/data.service';

const { players, getBestSelection } = usePlayer();

const isLoading = ref(true);

onMounted(async () => {
  try {
    await getBestSelection();
  } catch (error) {
    console.error("Could not fetch the best team:", error);
  } finally {
    isLoading.value = false;
  }
});

// Use computed properties to automatically filter players by position
const goalkeepers = computed(() => players.value.filter((p: Player) => p.position === 'Doelman'));
const defenders = computed(() => players.value.filter((p: Player) => p.position === 'Verdediger'));
const midfielders = computed(() => players.value.filter((p: Player) => p.position === 'Middenvelder'));
const attackers = computed(() => players.value.filter((p: Player) => p.position === 'Aanvaller'));

</script>

<template>
    <BaseLayout>
        <div class="card p-4">
            <div v-if="isLoading" class="flex justify-content-center p-8">
                <ProgressSpinner />
            </div>
            <div v-else class="flex justify-content-center">
                <div class="football-field">
                    <!-- Goalkeepers Row -->
                    <div class="player-row goalkeepers">
                        <PlayerCard v-for="player in goalkeepers" :key="player.name" :player="player" />
                    </div>
                    <!-- Defenders Row -->
                    <div class="player-row defenders">
                        <PlayerCard v-for="player in defenders" :key="player.name" :player="player" />
                    </div>
                    <!-- Midfielders Row -->
                    <div class="player-row midfielders">
                        <PlayerCard v-for="player in midfielders" :key="player.name" :player="player" />
                    </div>
                    <!-- Attackers Row -->
                    <div class="player-row attackers">
                        <PlayerCard v-for="player in attackers" :key="player.name" :player="player" />
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<style scoped>
.football-field {
    max-width: 800px;
    width: 100%;

    background-color: #28a745;
    background-image:
        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 100% 25%;
    border: 3px solid #fff;
    border-radius: 8px;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    overflow-x: auto;
}

.player-row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}
</style>
