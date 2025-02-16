import Vue from 'vue';
import VueRouter from 'vue-router';
import Users from '../views/usersList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/users',
    name: 'users',
    component: Users
  }
];

const router = new VueRouter({
  mode: 'history', // Use this instead of createWebHistory
  routes
});

export default router;
