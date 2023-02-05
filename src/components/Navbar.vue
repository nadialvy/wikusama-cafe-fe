<template>
  <header class="bg-white text-gray-800 py-6 fixed top-0 w-10/12 left-0 z-10" style="left: 253px;">
    <div class="flex justify-between px-8 items-center">
        <div>
            <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                </span>
                <input type="text" class="pl-12 py-1 rounded-3xl text-gray-500 bg-white border placeholder:font-light placeholder:text-sm border-gray-200 w-3/4 focus:outline-none focus:bg-white" placeholder="Search...">
            </div>
        </div>
        <div>
            <div class="flex justify-around items-start gap-x-5">
                <img src="../assets/user.jpg" alt="User Default Picture" class="w-10 rounded-lg">
                <div>
                    <p class="text-sm text-gray-500">Hi, Winter</p>
                    <p class="text-sm text-gray-500">Cashier</p>
                </div>
            </div>
        </div>
    </div>
  </header>
</template>

<style>

</style>