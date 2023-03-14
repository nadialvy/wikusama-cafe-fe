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
import NotFound from "../views/NotFound.vue";
import Unauthorized from "../views/Unauthorized.vue";
import store from "../store/index.js";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true,
      allowedRoles: ["manager"],
    },
  },
  {
    path: "/menu",
    name: "menu",
    component: Menu,
    meta: { requiresAuth: true, allowedRoles: ['manager', 'cashier', 'admin'] },
  },
  {
    path: "/menu/:id",
    name: "detailmenu",
    component: DetailMenu,
    meta: { requiresAuth: true, allowedRoles: ['manager', 'cashier', 'admin'] },
  },
  {
    path: "/table",
    name: "table",
    component: Table,
    meta: { requiresAuth: true, allowedRoles: ['cashier', 'admin'] },
  },
  {
    path: "/user",
    name: "user",
    component: User,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: "/order",
    name: "order",
    component: Order,
    meta: { requiresAuth: true, allowedRoles: ['cashier', 'manager'] },
  },
  {
    path: "/invoice/:id",
    name: "invoice",
    component: Invoice,
    meta: { requiresAuth: true, allowedRoles: ['cashier'] },
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
    meta: { requiresAuth: true, allowedRoles: ['cashier', 'manager', 'admin'] },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      requiresAuth: true,
      allowedRoles: ['cashier', 'manager', 'admin']
    }
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: Unauthorized,
    meta: {
      requiresAuth: true,
      allowedRoles: ['cashier', 'manager', 'admin']
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if the user is logged in
    if (!store.state.auth.status.loggedIn) {
      // Redirect the user to the login page with the original URL as a parameter
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      // Check if the user has the required role
      if (to.meta.allowedRoles.includes(store.state.auth.user.user.role)) {
        // User has the required role, allow access
        next();
      } else {
        // User does not have the required role, show unauthorized access message
        next({ name: "unauthorized" });
      }
    }
  } else {
    // Route does not require authentication, allow access
    next();
  }
});

export default router;
