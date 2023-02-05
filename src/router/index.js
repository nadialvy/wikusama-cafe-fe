import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Menu from "../views/Menu.vue";
import DetailMenu from "../views/DetailMenu.vue";
import Table from "../views/Table.vue";
import Order from "../views/Order.vue";
import User from "../views/User.vue";

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
    },
    {
        path: "/menu/:id",
        name: "detailmenu",
        component: DetailMenu,
    },
    {
        path: "/table",
        name: "table",
        component: Table,
    },
    {
        path: "/user",
        name: "user",
        component: User,
    },
    {
        path: "/order",
        name: "order",
        component: Order,
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router