<script setup>
import Side from "./Side.vue";
</script>

<template>
  <aside class="w-2/12 bg-white text-gray-500 h-screen">
    <img src="../assets/wikusama-logo.svg" class="px-6 py-5" />
    <div class="border-t-2 border-gray-200"></div>
    <nav>
      <ul class="list-none px-6">
        <p
          class="text-gray-400 text-sm mb-4 mt-8"
          v-if="userRole === 'manager'"
        >
          Home
        </p>
        <router-link to="/" v-if="userRole === 'manager'">
          <li class="mb-2">
            <img src="../assets/Category.svg" class="inline mr-5" />
            <a
              href="#"
              :class="[$route.path === '/' ? 'text-orange-500 font-bold' : 'text-gray-300']"
              class="text-sm hover:text-orange-500"
              >Dashboard</a
            >
            <div class="border-t-2 border-gray-200 mt-4"></div>
          </li>
        </router-link>

        <p class="text-gray-400 text-sm mb-4 mt-8">Pages</p>
        <router-link to="/menu">
          <li class="mb-6">
            <div class="flex justify-between items-center">
              <div class="flex justify-start">
                <img src="../assets/menu.png" class="mr-5 w-5" />
                <a
                  href="#"
                  :class="[$route.path === '/menu' ? 'text-orange-500 font-bold' : 'text-gray-300']"
                  class=" hover:text-orange-500 text-sm"
                  >Menu</a
                >
              </div>
              <img src="../assets/arrow-left.svg" />
            </div>
          </li>
        </router-link>
        <router-link to="/table" v-if="userRole !== 'manager'">
          <li class="mb-6">
            <div class="flex justify-between items-center">
              <div class="flex justify-start">
                <img src="../assets/table.png" class="mr-5 w-5" />
                <a
                  href="#"
                  :class="[$route.path === '/table' ? 'text-orange-500 font-bold' : 'text-gray-300']"
                  class="hover:text-orange-500 text-sm"
                  >Table</a
                >
              </div>
              <img src="../assets/arrow-left.svg" />
            </div>
          </li>
        </router-link>
        <router-link to="/order" v-if="userRole !== 'admin'">
          <li class="mb-6">
            <div class="flex justify-between items-center">
              <div class="flex justify-start">
                <img src="../assets/shopping-list.png" class="mr-5 w-5" />
                <a
                  href="#"
                  :class="[$route.path === '/order' ? 'text-orange-500 font-bold' : 'text-gray-300']"
                  class="hover:text-orange-500 text-sm"
                  >Order</a
                >
              </div>
              <img src="../assets/arrow-left.svg" />
            </div>
          </li>
        </router-link>
        <router-link to="/user" v-if="userRole === 'admin'">
          <li class="mb-6">
            <div class="flex justify-between items-center">
              <div class="flex justify-start">
                <img src="../assets/man-user.png" class="mr-5 w-5" />
                <a
                  href="#"
                  :class="[$route.path === '/user' ? 'text-orange-500 font-bold' : 'text-gray-300']"
                  class=" hover:text-orange-500 text-sm"
                  >User</a
                >
              </div>
              <img src="../assets/arrow-left.svg" />
            </div>
          </li>
        </router-link>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  computed: {
    userRole() {
      let userData = JSON.parse(localStorage.getItem("user"));
      return userData ? userData.user.role : "";
    },
  },
};
</script>
