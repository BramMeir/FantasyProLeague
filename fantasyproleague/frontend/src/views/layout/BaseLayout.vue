<script setup lang="ts">
import BaseHeader from '@/views/layout/BaseHeader.vue';
</script>

<template>  
    <div>
        <BaseHeader />
        <main class="main-content">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
.main-content {
    padding: 0 2rem;
}
</style>
