import {createRouter, createWebHistory} from 'vue-router';
import BestPerforming from '@/views/BestPerforming.vue';
import BestPriceWise from '@/views/BestPriceWise.vue';
import BestTeam from '@/views/BestTeam.vue';

const routes = [
    // Home page
    {path: '/', component: BestPerforming, name: 'home'},

    // Best price wise
    {path: '/best-price', component: BestPriceWise, name: 'best-price'},

    // Best team
    {path: '/best-team', component: BestTeam, name: 'best-team'},

    // Make sure to keep this as the last route, as it will default to the home page
    {path: '/:pathMatch(.*)*', redirect: {name: 'home'}},
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    routes,
});

export default router;