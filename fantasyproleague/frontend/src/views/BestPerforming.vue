<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { usePlayer } from '@/composables/services/data.service.ts';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import BaseLayout from '@/views/layout/BaseLayout.vue';

/* Composables */
const { players, getBestPerformingPlayers } = usePlayer();

/* Refs for user input and component state */
const positionOptions = [
  { label: 'Alle posities', value: 'Alle posities' },
  { label: 'Aanvaller', value: 'Aanvaller' },
  { label: 'Middenvelder', value: 'Middenvelder' },
  { label: 'Verdediger', value: 'Verdediger' },
  { label: 'Doelman', value: 'Doelman' },
];

const position = ref(positionOptions[0].value)
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

watch([numberOfPlayers, position], () => {
    fetchBestPerformingPlayers();
});

</script>

<template>
    <BaseLayout>
        <div class="player-performance-finder">
            <Card>
                <template #title>
                    <h2 class="m-0">Best presterende spelers</h2>
                </template>
                <template #content>
                    <div class="form-container">
                        <div class="p-field">
                            <label for="position">Positie</label>
                            <Select
                                id="position"
                                v-model="position"
                                :options="positionOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Selecteer positie"
                            />
                        </div>
                        <div class="p-field">
                            <label for="numberOfPlayers">Aantal Spelers</label>
                            <InputNumber
                                id="numberOfPlayers"
                                v-model="numberOfPlayers"
                                :min="1"
                                :max="50"
                            />
                        </div>
                        <Button
                            label="Zoeken"
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
                                Resultaten voor '{{ position }}'
                            </div>
                        </template>

                        <Column header="#" style="width: 3rem; text-align: center;">
                            <template #body="slotProps">
                                {{ slotProps.index + 1 }}
                            </template>
                        </Column>

                        <Column field="name" header="Naam"></Column>
                        <Column field="team" header="Team"></Column>
                        <Column field="position" header="Positie"></Column>
                        <Column field="goals" header="Doelpunten" sortable></Column>
                        <Column field="assists" header="Assists" sortable></Column>
                        <Column field="price" header="Prijs" sortable></Column>
                        <Column field="points" header="Punten" sortable>
                            <template #body="slotProps">
                                <strong>{{ slotProps.data.points }}</strong>
                            </template>
                        </Column>

                    </DataTable>
                </div>
                <div v-else class="no-results">
                    <p>Geen spelers gevonden voor de geselecteerde criteria. Probeer een andere zoekopdracht.</p>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>

<style scoped>
.player-performance-finder {
    max-width: 900px;
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