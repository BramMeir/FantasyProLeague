<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
</script>

<template>
    <div class="card">
        <Toolbar class="base-header">
            <template #start>
                <div class="flex align-items-center gap-2">
                    <i class="pi pi-chart-bar" style="font-size: 1.5rem"></i>
                    <span class="font-bold text-lg">Fantasy Pro League Optimizer</span>
                </div>
            </template>

            <template #end>
                <div class="flex align-items-center gap-2">
                    <RouterLink to="/" v-slot="{ isActive }">
                        <Button
                            label="Best Performing"
                            icon="pi pi-star"
                            :class="['p-button-text', { 'active-link': isActive }]"
                        />
                    </RouterLink>
                    <RouterLink to="/best-price" v-slot="{ isActive }">
                         <Button
                            label="Best Value"
                            icon="pi pi-euro"
                            :class="['p-button-text', { 'active-link': isActive }]"
                        />
                    </RouterLink>
                    <RouterLink to="/best-team" v-slot="{ isActive }">
                        <Button
                            label="Best Team"
                            icon="pi pi-users"
                            :class="['p-button-text', { 'active-link': isActive }]"
                        />
                    </RouterLink>
                </div>
            </template>
        </Toolbar>
    </div>
</template>

<style scoped>
.base-header {
    margin-bottom: 2rem;
    border-radius: 8px;
    background-color: var(--surface-card);
    border: 1px solid var(--surface-border);
}

.active-link {
    color: var(--primary-color) !important;
    background-color: var(--primary-color-text);
}

a {
    text-decoration: none;
}
</style>