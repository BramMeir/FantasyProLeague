<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import BaseLayout from '@/views/layout/BaseLayout.vue';
import PlayerCard from '@/components/PlayerCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import { Player } from '@/types/Player';
import { usePlayer } from '@/composables/services/data.service';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Checkbox from 'primevue/checkbox';

const { players, bestPlayers, getAllPlayers, getBestSelection } = usePlayer();

// State for the UI
const isLoading = ref(true);
const isGenerating = ref(false);

// State for user interaction
type PlayerState = 'neutral' | 'include' | 'exclude';
const playerStates = ref<Record<number, PlayerState>>({});
const searchQuery = ref('');
const maxBudget = ref(100);

// Fetch initial data on component mount
onMounted(async () => {
  try {
    // Fetch all the players
    await getAllPlayers();
    // Then, get an initial optimal team
    await getBestSelection(maxBudget.value, [], []);
  } catch (error) {
    console.error("Could not fetch initial data:", error);
  } finally {
    isLoading.value = false;
  }
});

const togglePlayerState = (id: number) => {
    const current = playerStates.value[id] ?? 'neutral';
    playerStates.value[id] =
        current === 'neutral' ? 'include'
        : current === 'include' ? 'exclude'
        : 'neutral';
};

// This function is called when the user clicks the "Generate" button
const generateOptimalTeam = async () => {
    isGenerating.value = true;
    try {
        // Map the selected players to the format the API expects
        const mustHave = players.value
            .filter((p: Player) => playerStates.value[p.id] === 'include')
            .map((p: Player) => ({ name: p.name, teamShortName: p.teamShortName }));

        // Map the excluded players to the format the API expects
        const excluded = players.value
            .filter((p: Player) => playerStates.value[p.id] === 'exclude')
            .map((p: Player) => ({ name: p.name, teamShortName: p.teamShortName }));
        
        // Call the API with the user's selection
        await getBestSelection(maxBudget.value, mustHave, excluded);

    } catch (error) {
        console.error("Failed to generate optimal team:", error);
    } finally {
        isGenerating.value = false;
    }
};

const filteredPlayers = computed(() => {
    // If there are no players or no search query, return the full list
    if (!players.value) return [];
    if (!searchQuery.value) return players.value;

    // Filter the players array, case-insensitively
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return players.value.filter((player: Player) =>
        player.name.toLowerCase().includes(lowerCaseQuery)
    );
});

// Computed properties for the football field (based on `bestPlayers`)
const goalkeepers = computed(() => bestPlayers.value.filter((p: Player) => p.position === 'Doelman'));
const defenders = computed(() => bestPlayers.value.filter((p: Player) => p.position === 'Verdediger'));
const midfielders = computed(() => bestPlayers.value.filter((p: Player) => p.position === 'Middenvelder'));
const attackers = computed(() => bestPlayers.value.filter((p: Player) => p.position === 'Aanvaller'));

const totalCost = computed(() => {
    return bestPlayers.value.reduce((sum: number, player: Player) => sum + player.price, 0);
});
const totalPoints = computed(() => {
    return bestPlayers.value.reduce((sum: number, player: Player) => sum + player.points, 0);
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
                        <span class="total-value cost">€{{ totalCost.toFixed(1) }}/{{ maxBudget }}M</span>
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="flex justify-content-center p-8">
                <ProgressSpinner />
            </div>

            <div v-else class="grid">
                <!-- Left Column: Football Field -->
                <div class="col-12 md:col-7 lg:col-8">
                    <div class="football-field">
                        <div class="player-row goalkeepers">
                            <PlayerCard v-for="player in goalkeepers" :key="player.id" :player="player" />
                        </div>
                        <div class="player-row defenders">
                            <PlayerCard v-for="player in defenders" :key="player.id" :player="player" />
                        </div>
                        <div class="player-row midfielders">
                            <PlayerCard v-for="player in midfielders" :key="player.id" :player="player" />
                        </div>
                        <div class="player-row attackers">
                            <PlayerCard v-for="player in attackers" :key="player.id" :player="player" />
                        </div>
                    </div>
                </div>

                <!-- Right Column: Player Selection Table -->
                <div class="col-12 md:col-5 lg:col-4">
                    <!-- Budget Input -->
                    <div class="field mb-3">
                        <label for="budget" class="block mb-2 font-medium">Maximaal Budget</label>
                        <IconField iconPosition="left" class="w-full">
                            <InputIcon class="pi pi-euro"></InputIcon>
                            <InputText 
                                id="budget"
                                v-model.number="maxBudget" 
                                type="number" 
                                placeholder="Budget invoeren..."
                            />
                        </IconField>
                    </div>

                    <div class="player-list-container">
                        <h2 class="text-xl font-semibold mb-3">Selecteer Spelers</h2>
                        <Button
                            label="Genereer Optimaal Team"
                            icon="pi pi-cog"
                            class="w-full mb-3"
                            :loading="isGenerating"
                            @click="generateOptimalTeam"
                        />

                        <IconField iconPosition="left" class="w-full mb-3">
                            <InputIcon class="pi pi-search"></InputIcon>
                            <InputText
                                v-model="searchQuery"
                                placeholder="Zoek op naam..."
                                class="w-full"
                            />
                        </IconField>
                        <DataTable
                            :value="filteredPlayers"
                            v-model:selection="selectedPlayers"
                            dataKey="id"
                            :paginator="true"
                            :rows="10"
                            size="small"
                        >
                            <Column header="Status" headerStyle="width: 3rem">
                                <template #body="{ data }">
                                    <Button
                                        text
                                        rounded
                                        @click="togglePlayerState(data.id)"
                                        :icon="
                                            playerStates[data.id] === 'include' ? 'pi pi-check-circle'
                                            : playerStates[data.id] === 'exclude' ? 'pi pi-times-circle'
                                            : 'pi pi-minus-circle'
                                        "
                                        :severity="
                                            playerStates[data.id] === 'include' ? 'success'
                                            : playerStates[data.id] === 'exclude' ? 'danger'
                                            : 'secondary'
                                        "
                                    />
                                </template>
                            </Column>

                            <Column field="name" header="Naam" sortable></Column>
                            <Column field="price" header="Prijs" sortable>
                                 <template #body="slotProps">
                                    €{{ slotProps.data.price }}M
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<style scoped>
.stats-header {
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
    gap: 1rem; padding: 0 1rem 1.5rem 1rem; border-bottom: 1px solid var(--surface-border);
    margin-bottom: 1.5rem;
}
.totals-container { display: flex; gap: 1.5rem; }
.total-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
.total-label { font-size: 0.85rem; color: var(--text-color-secondary); }
.total-value { font-size: 1.5rem; font-weight: 700; }
.total-value.points { color: var(--primary-color); }
.total-value.cost { color: var(--green-500); }

.football-field {
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

.player-list-container {
    height: 100%;
}
</style>