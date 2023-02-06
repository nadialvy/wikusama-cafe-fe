<template>
    <div class="flex flex-col items-center hover:cursor-pointer -mt-4">
        <div class="w-32 h-32 rounded-full overflow-hidden shadow-xl" style="z-index: 1;">
            <img :src="img" class="w-full h-full object-cover" />
        </div>
        <div class="w-48 h-56 px-4 relative bottom-20 bg-white hoverable hover:bg-orange-400 rounded-2xl shadow-lg">
            <h2 class="pt-24 font-bold text-blue-300 text-start mt-4 truncate hover-white">{{ name }}</h2>
            <img src="../assets/star.svg" class="mb-4 img-change" />
            <p class="font-semibold text-orange-500 mt-2 hover-white">Rp.{{ price }}</p>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        img: String,
        name: String,
        price: String,
    })
</script>

<style>
  .hoverable:hover .hover-white {
    color: white;
  }
  .hoverable:hover .img-change {
    content: url("../assets/star-hover.svg");
  }
</style>

