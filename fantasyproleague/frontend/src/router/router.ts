import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/HomeView.vue';

const routes = [
    // Home page
    {path: '/home', component: Home, name: 'home'},

    // Make sure to keep this as the last route, as it will default to the home page
    {path: '/:pathMatch(.*)*', redirect: {name: 'home'}},
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
});

export default router;