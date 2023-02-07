import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Menu from "../views/Menu.vue";
import DetailMenu from "../views/DetailMenu.vue";
import Table from "../views/Table.vue";
import Order from "../views/Order.vue";
import User from "../views/User.vue";
import Login from "../views/Login.vue";
import Invoice from "../components/Invoice.vue";
import Profile from "../views/Profile.vue";
import store from "../store/index.js";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/menu",
    name: "menu",
    component: Menu,
    meta: { requiresAuth: true },
  },
  {
    path: "/menu/:id",
    name: "detailmenu",
    component: DetailMenu,
    meta: { requiresAuth: true },
  },
  {
    path: "/table",
    name: "table",
    component: Table,
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    name: "user",
    component: User,
    meta: { requiresAuth: true },
  },
  {
    path: "/order",
    name: "order",
    component: Order,
    meta: { requiresAuth: true },
  },
  {
    path: "/invoice/:id",
    name: "invoice",
    component: Invoice,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (store.state.auth.status.loggedIn) {
        next({ name: "home" });
      } else {
        next();
      }
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.auth.status.loggedIn) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
