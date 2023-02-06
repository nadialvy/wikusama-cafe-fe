<template>
    <div class="hover:cursor-pointer">
        <img :src="img" alt="menu-img" class="w-40 h-40">
        <p class="font-bold text-black text-start mt-4 truncate" style="width: 10rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ name }}</p>
        <p class="text-sm text-primaryYellow">Rp{{ price }}</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        img: String,
        name: String,
        price: String,
    })
</script>

