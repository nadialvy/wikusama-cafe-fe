<script setup>
import axios from "axios";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import authHeader from "../services/auth-header.js";
</script>
<template>
  <div class="bg-orange-100 h-screen">
    <div class="px-96 py-20">
      <div class="flex">
        <p class="-ml-32 mr-16 hover:cursor-pointer" @click="$router.go(-1)">
          <span class="text-xl">←</span> Back
        </p>
        <p class="text-xl font-bold text-blue-300">My Profile</p>
      </div>
      <div class="border border-gray-200 mb-10 mt-2"></div>
      <div>
        <p class="text-orange-600 text-xs font-light">Name</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.user_name }}</p>
          <button
            class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg"
          >
            Edit
          </button>
        </div>
        <div class="border border-gray-200 mb-10 mt-2"></div>
      </div>
      <div>
        <p class="text-orange-600 text-xs font-light">Username</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.username }}</p>
          <button
            class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg"
          >
            Edit
          </button>
        </div>
        <div class="border border-gray-200 mb-10 mt-2"></div>
      </div>
      <div>
        <p class="text-orange-600 text-xs font-light">Role</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">{{ userData.role }}</p>
        </div>
        <div class="border border-gray-200 mb-10 mt-2"></div>
      </div>
      <p class="text-xl font-bold text-blue-300">Security</p>
      <div class="border border-gray-200 mb-10 mt-2"></div>
      <div>
        <p class="text-orange-600 text-xs font-light">Password</p>
        <div class="flex justify-between items-start">
          <p class="text-blue-300 font-semibold">******</p>
          <button
            @click="showEditPass = true"
            class="border border-orange-500 px-6 py-1 text-orange-500 text-sm font-semibold hover:text-white hover:bg-orange-500 rounded-lg"
          >
            Edit
          </button>
        </div>
        <div class="border border-gray-200 mb-10 mt-2"></div>
      </div>
    </div>

    <div v-if="showEditPass" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black opacity-50"
        @click="showEditPass = false"
      ></div>
      <div
        class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-md md:h-auto"
      >
        <div class="flex justify-between mb-6">
          <p class="font-bold">Edit Password</p>
          <button @click="showEditPass = false">x</button>
        </div>
        <div>
          <input
            type="password"
            class="mb-4 border text-sm rounded-lg block w-full p-2.5"
            placeholder="Old Password"
            v-model="oldPassword"
            required
          />
          <div class="border border-gray-200 mt-6 mb-4"></div>
          <p class="font-semibold text-blue-300">Make New Password</p>
          <p class="text-gray-400 text-opacity-75 text-sm">
            Password must be minimal contains 6 character, it can be combination
            between abjad and number
          </p>
          <input
            type="password"
            class="my-4 border text-sm rounded-lg block w-full p-2.5"
            placeholder="New Password"
            v-model="newPassword"
            required
          />
          <input
            type="password"
            class="my-4 border text-sm rounded-lg block w-full p-2.5"
            placeholder="Confirm New Password"
            v-model="confirmPassword"
            required
          />
        </div>
        <p v-if="errorMessage !== ''">{{ errorMessage }}</p>
        <button
          v-on:click="saveData()"
          class="text-sm mt-4 mx-auto text-white bg-orange-500 py-2 w-full rounded-lg hover:bg-orange-600"
        >
          Edit Password
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/api/",
      userData: [],
      showEditPass: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  created() {
    this.userData = this.$store.state.auth.user.user;
  },
  mounted() {
    this.userData = this.$store.state.auth.user.user;
  },
  methods: {
    back() {
      this.$router.push({ name: "Dashboard" });
    },
    saveData() {
      let form = {
        old_password: this.oldPassword,
        new_password: this.newPassword,
        confirm_password: this.confirmPassword,
      };
      let headers = authHeader();
      axios.put(this.baseUrl + "updatepass/" + this.$store.state.auth.user.user.user_id, form, { headers }).then((response) => {
        this.createAlert(response.data.message, "success", 1500);
        this.showEditPass = false;
        location.reload();
      }).catch((error) => {
        console.log(error);
        this.createAlert(error.response.data.message, "danger", 1500);
      });
    },
    createAlert(message, type, timeout) {
      createToast(message, {
        position: "bottom-center",
        type: type,
        timeout: timeout,
        dismissible: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        closeOnClick: true,
        closeButton: true,
        icon: true,
        rtl: false,
      });
    },
  },
};
</script>
