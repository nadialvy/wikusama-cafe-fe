<script setup>
    import { createToast } from 'mosha-vue-toastify';
    import 'mosha-vue-toastify/dist/style.css';
    import axios from 'axios';
</script>

<template>
    <div class="bg-orange-100">
        <div class="flex justify-between items-center">
            <div class="w-1/3 px-12">
                <div>
                    <h1 class="text-blue-300 text-2xl text-center font-semibold">Sign In</h1>
                    <p class="text-gray-400 font-light text-center">Sign in to stay connected.</p>
                    <div class="mt-8">
                    <label for="username" class="block text-gray-400 mb-2 text-sm font-light">Username</label>
                        <input type="text" v-model="username" class="mb-4 border  border-orange-500 text-sm rounded-2xl block w-full p-2.5" required>
                    </div>
                    <div class="mt-4">
                        <label for="password" class="block text-gray-400 mb-2 text-sm font-light">Password</label>
                        <input type="password" v-model="password" class="mb-4 border  border-orange-500 text-sm rounded-2xl block w-full p-2.5" required>
                    </div>
                    <p class="text-orange-500 text-xs mb-10 text-end">Forgot Passowrd?</p>
                    <button v-on:click="handleLogin" class="bg-orange-500 w-full rounded-2xl text-white hover:bg-orange-600 py-2">Log In</button>
                </div>
            </div>
            <div class="w-2/3">
                <img src="../assets/hero-login.svg"/>
            </div>
        </div>
    </div>
</template>

<script>

</script>