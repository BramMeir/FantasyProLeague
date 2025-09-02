<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Player } from '@/types/Player';
import Button from 'primevue/button';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';

/*
 * PROPS
 * title: The title to display in the card.
 * fetchPlayerData: The specific function to call for fetching data.
 */
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  fetchPlayerData: {
    type: Function,
    required: true,
  },
  players: {
    type: Array as () => Player[],
    required: true,
  },
});

/* Composables */
const isLoading = ref(false);

const positionOptions = [
  { label: 'Alle posities', value: 'Alle posities' },
  { label: 'Aanvaller', value: 'Aanvaller' },
  { label: 'Middenvelder', value: 'Middenvelder' },
  { label: 'Verdediger', value: 'Verdediger' },
  { label: 'Doelman', value: 'Doelman' },
];

const position = ref(positionOptions[0].value);
const numberOfPlayers = ref(10);

/* Generic fetch function that uses the passed-in prop */
const fetchPlayers = async () => {
  if (isLoading.value || !numberOfPlayers.value || !position.value) {
    return;
  }

  isLoading.value = true;
  try {
    await props.fetchPlayerData(numberOfPlayers.value, position.value);
  } catch (error) {
    console.error("Failed to fetch players:", error);
    props.players = []; // Clear players on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPlayers);
watch([numberOfPlayers, position], fetchPlayers);
</script>

<template>
    <div class="player-table-container">
        <Card>
            <template #title>
                <h2 class="m-0">{{ title }}</h2>
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
                        @click="fetchPlayers"
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
                    
                    <!-- SLOT FOR EXTRA COLUMNS -->
                    <slot name="extra-columns"></slot>

                </DataTable>
            </div>
            <div v-else class="no-results">
                <p>Geen spelers gevonden voor de geselecteerde criteria. Probeer een andere zoekopdracht.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player-table-container {
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
