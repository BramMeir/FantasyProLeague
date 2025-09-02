<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <header class="base-header">
        <nav class="navigation">
            <RouterLink to="/" class="nav-link">Best Performing Players</RouterLink>
            <RouterLink to="/best-price" class="nav-link">Price-Wise Players</RouterLink>
        </nav>
    </header>
</template>

<style scoped>
.base-header {
    background-color: #f8f9fa;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.navigation {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    text-decoration: none;
    color: #333;
    font-weight: 600;
    transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #007bff;
}
</style>
