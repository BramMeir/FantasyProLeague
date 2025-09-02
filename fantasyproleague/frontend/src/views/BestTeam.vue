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
    isLoading.value = false;
    console.log(isLoading.value);
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

const totalCost = computed(() => {
    return players.value.reduce((sum: number, player: Player) => sum + player.price, 0);
});

const totalPoints = computed(() => {
    return players.value.reduce((sum: number, player: Player) => sum + player.points, 0);
});
</script>

<template>
    <BaseLayout>
        <div class="card p-4">
            <div class="stats-header">
                <h1 class="text-2xl font-bold m-0">Optimale Selectie</h1>
                <div class="totals-container">
                    <div class="total-item">
                        <span class="total-label">Totaal Punten</span>
                        <span class="total-value points">{{ totalPoints.toLocaleString() }}</span>
                    </div>
                    <div class="total-item">
                        <span class="total-label">Totaal Budget</span>
                        <span class="total-value cost">€{{ totalCost }}M</span>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-content-center p-8">
                <ProgressSpinner />
            </div>

            <div v-else class="field-container">
                <div class="football-field">
                    <div class="player-row goalkeepers">
                        <PlayerCard v-for="player in goalkeepers" :key="player.name" :player="player" />
                    </div>
                    <div class="player-row defenders">
                        <PlayerCard v-for="player in defenders" :key="player.name" :player="player" />
                    </div>
                    <div class="player-row midfielders">
                        <PlayerCard v-for="player in midfielders" :key="player.name" :player="player" />
                    </div>
                    <div class="player-row attackers">
                        <PlayerCard v-for="player in attackers" :key="player.name" :player="player" />
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<style scoped>
.stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 0 1rem 1.5rem 1rem;
    border-bottom: 1px solid var(--surface-border);
    margin-bottom: 1.5rem;
}

.totals-container {
    display: flex;
    gap: 1.5rem;
}

.total-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.total-label {
    font-size: 0.85rem;
    color: var(--text-color-secondary);
}

.total-value {
    font-size: 1.5rem;
    font-weight: 700;
}

.total-value.points {
    color: var(--primary-color);
}

.total-value.cost {
    color: var(--green-500);
}

.field-container {
    max-width: 800px;
    margin: 0 auto;
}

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
