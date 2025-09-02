import {createRouter, createWebHistory} from 'vue-router';
import BestPerforming from '@/views/BestPerforming.vue';
import BestPriceWise from '@/views/BestPriceWise.vue';

const routes = [
    // Home page
    {path: '/', component: BestPerforming, name: 'home'},

    // Best price wise
    {path: '/best-price', component: BestPriceWise, name: 'best-price'},

    // Make sure to keep this as the last route, as it will default to the home page
    {path: '/:pathMatch(.*)*', redirect: {name: 'home'}},
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
});

export default router;