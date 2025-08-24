<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePlayer } from '@/composables/services/data.service.ts';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

/* Composables */
const { players, getBestPerformingPlayers } = usePlayer();

/* Refs for user input and component state */
const position = ref('Middenvelder');
const numberOfPlayers = ref(10);
const isLoading = ref(false);

/* Fetch the best performing players */
const fetchBestPerformingPlayers = async () => {
    // Prevent fetching if already loading or inputs are invalid
    if (isLoading.value || !numberOfPlayers.value || !position.value) {
        return;
    }

    isLoading.value = true;
    try {
        await getBestPerformingPlayers(numberOfPlayers.value, position.value);
        console.log(players.value);
    } catch (error) {
        console.error("Failed to fetch players:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchBestPerformingPlayers();
});

</script>

<template>
    <div class="player-performance-finder">
        <Card>
            <template #title>
                <h2 class="m-0">Find Best Performing Players</h2>
            </template>
            <template #content>
                <p>Select a position and the number of players you want to see.</p>
                <div class="form-container">
                    <div class="p-field">
                        <label for="position">Position</label>
                        <InputText id="position" v-model="position" placeholder="e.g., Forward" />
                    </div>
                    <div class="p-field">
                        <label for="numberOfPlayers">Number of Players</label>
                        <InputNumber id="numberOfPlayers" v-model="numberOfPlayers" :min="1" :max="50" />
                    </div>
                    <Button
                        label="Search"
                        icon="pi pi-search"
                        @click="fetchBestPerformingPlayers"
                        :loading="isLoading"
                    />
                </div>
            </template>
        </Card>

        <div class="results-container">
            <div v-if="isLoading" class="loading-overlay">
                <ProgressSpinner />
            </div>
            <div v-else-if="players && players.length > 0">
                 <DataTable :value="players" responsiveLayout="scroll">
                    <template #header>
                        <div class="table-header">
                            Results for '{{ position }}'
                        </div>
                    </template>

                    <Column field="name" header="Name"></Column>
                    <Column field="team" header="Team"></Column>
                    <Column field="price" header="Price" sortable></Column>
                    <Column field="goals" header="Goals" sortable></Column>
                    <Column field="assists" header="Assists" sortable></Column>
                    <Column field="points" header="Points" sortable>
                        <template #body="slotProps">
                            <strong>{{ slotProps.data.points }}</strong>
                        </template>
                    </Column>

                </DataTable>
            </div>
            <div v-else class="no-results">
                <p>No players found for the selected criteria. Try a different search.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-performance-finder {
    max-width: 800px;
    margin: 2rem auto;
}

.form-container {
    display: flex;
    align-items: flex-end;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
}

.p-field {
    display: flex;
    flex-direction: column;
}

.p-field label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color-secondary);
}

.results-container {
    margin-top: 2rem;
    position: relative;
}

.loading-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
}

.table-header {
    font-size: 1.2rem;
    font-weight: bold;
}

.no-results {
    text-align: center;
    padding: 2rem;
    background-color: var(--surface-b);
    border-radius: 6px;
    color: var(--text-color-secondary);
}
</style>