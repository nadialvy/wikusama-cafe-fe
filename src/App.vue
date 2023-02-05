<template>
  <div class="flex h-screen">
    <Sidebar />
    <Navbar />
    <main class="flex-1 bg-orange-50 p-8 mt-16">
      <h3 class="text-lg font-medium mb-4">Main Content</h3>
      <p>Welcome to my Vue project</p>
    </main>
  </div>
</template>

<script>
import Sidebar from '../src/components/Sidebar.vue';
import Navbar from '../src/components/Navbar.vue';

export default {
  components: {
    Sidebar,
    Navbar,
  },
};
</script>

<style>

</style>
