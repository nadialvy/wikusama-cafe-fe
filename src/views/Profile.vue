<template>
  <div class="bg-orange-100 h-screen">
    <div class="px-96 py-20">
      <p class="text-xl font-bold text-blue-300">My Profile</p>
      <div class="border border-gray-400 mb-10 mt-2"></div>
      <div>
        <p class="text-gray-500 text-xs font-light">Name</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.user_name }}</p>
          <button class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg">Edit</button>
        </div>
        <div class="border border-gray-400 mb-10 mt-2"></div>
      </div>
      <div>
        <p class="text-gray-500 text-xs font-light">Username</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.username }}</p>
          <button class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg">Edit</button>
        </div>
        <div class="border border-gray-400 mb-10 mt-2"></div>
      </div>
      <div>
        <p class="text-gray-500 text-xs font-light">Role</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.role }}</p>
          <button class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg">Edit</button>
        </div>
        <div class="border border-gray-400 mb-10 mt-2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: [],
    };
  },
  created() {
    this.userData = this.$store.state.auth.user.user;
  },
  mounted() {
    this.userData = this.$store.state.auth.user.user;
  },
};
</script>
