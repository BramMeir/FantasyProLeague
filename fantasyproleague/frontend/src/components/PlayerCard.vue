<script setup lang="ts">
import { computed } from 'vue';
import Tag from 'primevue/tag';

const props = defineProps({
  player: {
    type: Object,
    required: true,
  }
});

const formattedPrice = computed(() => `€${props.player.price}M`);

const imageUrl = computed(() => `https://fanarena.s3.eu-west-1.amazonaws.com/players/dummy-${props.player.team}.png`);

const onImageError = (event: Event) => {
  // If a player image is not found, show a default silhouette
  (event.target as HTMLImageElement).src = 'https://fanarena.s3.eu-west-1.amazonaws.com/players/dummy-westerlo.png';
};
</script>

<template>
    <div class="player-card text-center">
        <div class="player-image-container">
            <img :src="imageUrl" :alt="player.name" @error="onImageError" class="player-image" />
        </div>
        <div class="player-info">
            <span class="player-name font-bold">{{ player.name }}</span>
            <Tag :value="formattedPrice" severity="success"></Tag>
        </div>
    </div>
</template>

<style scoped>
.player-card {
    width: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.player-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    background-color: var(--surface-200);
    border-radius: 50%;
    border: 2px solid var(--surface-300);
}

.player-info {
    background-color: var(--surface-800);
    color: var(--surface-0);
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    width: 100%;
    text-align: center;
}

.player-name {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
}
</style>
