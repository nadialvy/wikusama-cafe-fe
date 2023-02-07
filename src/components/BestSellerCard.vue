<template>
  <div class="flex justify-end gap-x-6 items-start mb-10 hover:cursor-pointer">
    <img :src="img" alt="menu-img" class="w-20 h-20 rounded-xl" />
    <div>
      <p
        class="text-blue-300 font-bold truncate text-lg"
        style="
          width: 8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
      >
        {{ name }}
      </p>
      <p
        class="text-blue-300 truncate text-xs text-opacity-80 font-light my-1"
        style="
          width: 6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
      >
        {{ description }}
      </p>
      <p class="text-orange-500 text-sm font-bold">Rp{{ price }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  description: String,
  img: String,
  price: String,
});
</script>
