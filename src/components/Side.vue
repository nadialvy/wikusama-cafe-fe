<template>
    <li class="mb-6">
        <div class="flex justify-between items-center">
            <div class="flex justify-start">
                <img :src="imgpath" class="mr-5 w-5" />
                <a :href="href" class="text-gray-400 hover:text-orange-500 text-sm font-light">{{ text }}</a>
            </div>
            <img src="../assets/arrow-left.svg" />
        </div>
    </li>
</template>

<script setup>
    const props = defineProps({
        imgpath: String,
        href: String,
        text: String,
    })
</script>