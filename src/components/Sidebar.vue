<script setup>
    import Side from './Side.vue';

</script>

<template>
  <aside class="w-2/12 bg-white text-gray-500 h-full">
    <img src="../assets/wikusama-logo.svg" class="px-6 py-5"/>
    <div class="border-t-2 border-gray-200"></div>
    <nav>
        <ul class="list-none px-6">
            <p class="text-gray-400 text-sm mb-4 mt-8">Home</p>
            <router-link to="/">
                <li class="mb-2">
                    <img src="../assets/Category.svg" class="inline mr-5" />
                    <a href="#" class="text-gray-400 hover:text-orange-500 text-sm font-light">Dashboard</a>
                    <div class="border-t-2 border-gray-200 mt-4"></div>
                </li>
            </router-link>

            <p class="text-gray-400 text-sm mb-4 mt-8">Pages</p>
            <router-link to="/menu">
                <li class="mb-6">
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start">
                            <img src="../assets/menu.png" class="mr-5 w-5" />
                            <a href="#" class="text-gray-400 hover:text-orange-500 text-sm font-light">Menu</a>
                        </div>
                        <img src="../assets/arrow-left.svg" />
                    </div>
                </li>
            </router-link>
            <router-link to="/table">
                <li class="mb-6">
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start">
                            <img src="../assets/table.png" class="mr-5 w-5" />
                            <a href="#" class="text-gray-400 hover:text-orange-500 text-sm font-light">Table</a>
                        </div>
                        <img src="../assets/arrow-left.svg" />
                    </div>
                </li>
            </router-link>
            <router-link to="/order">
                <li class="mb-6">
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start">
                            <img src="../assets/shopping-list.png" class="mr-5 w-5" />
                            <a href="#" class="text-gray-400 hover:text-orange-500 text-sm font-light">Order</a>
                        </div>
                        <img src="../assets/arrow-left.svg" />
                    </div>
                </li>
            </router-link>
            <router-link to="/user">
                <li class="mb-6">
                    <div class="flex justify-between items-center">
                        <div class="flex justify-start">
                            <img src="../assets/man-user.png" class="mr-5 w-5" />
                            <a href="#" class="text-gray-400 hover:text-orange-500 text-sm font-light">User</a>
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
</script>