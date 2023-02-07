<script setup>
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import authHeader from "../services/auth-header.js";
import axios from 'axios';
import { createToast } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';
import _ from 'lodash';
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <Navbar />
    <main class="w-10/12 flex-1 bg-orange-50 p-8 mt-16">
      <!-- search and add button -->
      <div class="py-8 flex justify-between items-center">
          <div class="flex items-center justify-center">
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                  </span>
                  <input @keyup.enter="search()" v-model="searchKey" type="text" class="pl-12 py-2 rounded-3xl text-gray-500 bg-white border placeholder:font-light placeholder:text-sm border-orange-300 focus:outline-none focus:bg-white" placeholder="Search...">
              </div>
          </div>
          <button class="bg-orange-400 px-10 py-2 text-white text-sm rounded-2xl hover:bg-orange-500" v-on:click="addData()" @click="showModal = true">Add User +</button>
      </div>

      <!-- table section -->
      <div v-if="loading">
        <img src="../assets/loading.gif" alt="Loading..." class="mx-auto my-auto w-20 py-56">
      </div>
      <div v-else>
        <div class="flex flex-col pb-20">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table class="min-w-full">
                            <thead class="bg-transparent border-b">
                                <tr class="text-center">
                                    <th scope="col" class="text-sm font-semibold text-orange-500 px-6 py-4">#</th>
                                    <th scope="col" class="text-sm font-semibold text-orange-500 px-6 py-4">Name</th>
                                    <th scope="col" class="text-sm font-semibold text-orange-500 px-6 py-4">User Name</th>
                                    <th scope="col" class="text-sm font-semibold text-orange-500 px-6 py-4">Role</th>
                                    <th scope="col" class="text-sm font-semibold text-orange-500 px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody class="v-auto-animate">
                                <tr v-for="(user, i) in users" :key="i" class="bg-transparent border-b transition duration-300 text-center ease-in-out hover:bg-orange-200">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i+1 }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ user.user_name }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ user.role }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap hover:cursor-pointer">
                                        <div class="flex justify-evenly items-center hover:cursor-pointer">
                                            <img @click="showModal = true" v-on:click="editData(user)" src="../assets/edit.png" class="w-5 h-5" alt="Edit">
                                            <img @click="showConfirmDialog(user.user_id)" src="../assets/delete.png" alt="Delete" class="w-5 h-5">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>

       <!-- delete dialog -->
        <div>
            <div v-if="showDialog" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black opacity-50" @click="showDialog = false"></div>
                <div class="top-80 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                    <p class="text-base font-medium">Are you sure you want to delete this?</p>
                    <div class="flex justify-end mt-4">
                        <button @click="showDialog = false" class="bg-gray-300 hover:bg-gray-600 py-1 px-10 text-gray-700 hover:text-white rounded-lg mr-4">Cancel</button>
                        <button @click="deleteData(order_id)" class="border border-orange-500 hover:bg-orange-500 hover:text-white py-1 px-10 text-orange-500 rounded-lg">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- add edit menu modal -->
        <div v-if="showModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black opacity-50" @click="showModal = false"></div>
            <div class="top-32 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                <div class="flex justify-between mb-6">
                    <p class="font-bold text-xl">{{ action }} User</p>
                    <button @click="showModal = false" class="text-2xl font-medium">x</button>
                </div>
                <div class="overflow-y-scroll h-[350px]">
                    <!-- modal content goes here -->
                    <div class="px-4">
                        <div>
                            <label for="user_name" class="block mb-2 text-sm font-medium">Name</label>
                            <input type="text" v-model="user_name" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: Aditya Pratama" required>
                        </div>
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium">Username</label>
                            <input type="text" v-model="username" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: aditp_" required>
                        </div>
                        <div>
                            <label for="role" class="block mb-2 text-sm font-medium">Role</label>
                            <select v-model="role" class="mb-4 border text-sm rounded-lg block w-full p-2.5">
                                <option value="" disabled>Choose Role</option>
                                <option value="manager">Manager</option>
                                <option value="cashier">Cashier</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button v-on:click="saveData()" class="text-sm mt-4 mx-auto text-orange-500 border border-orange-500 py-2  w-full rounded-lg hover:bg-orange-500 hover:text-white">{{ action }} User</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseURL: "http://127.0.0.1:8000/api/user/",
      // modal
      showDialog: false,
      showModal: false,

      // get data
      users: [],
      loading: true,

      // form
      action: "",
      user_id: "",
      user_name: "",
      username: "",
      role: "",

      // search
      searchKey: "",
      notFound: false,
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    searchKey: _.debounce(function (newVal) {
      if (newVal.length > 0) {
        this.notFound = false;

        let headers = authHeader();

        axios
          .get(this.baseURL + "search/" + this.searchKey, { headers })
          .then((response) => {
            this.notFound = false;
            this.users = response.data.data;
          })
          .catch((error) => {
            this.notFound = true;
            this.users = [];
          });
      } else {
        this.notFound = false;
        this.getData();
      }
    }),
  },
  methods: {
    // search
    search() {
      let headers = authHeader();
      axios.get(this.baseURL + "search/" + this.searchKey, { headers }).then((response) => {
        this.notFound = false;
        this.users = response.data.data;
      });
    },
    // crud
    showConfirmDialog(user_id) {
      this.user_id = user_id;
      this.showDialog = true;
    },
    getData() {
      let headers = authHeader();
      axios
        .get(this.baseURL, { headers })
        .then((response) => {
          this.users = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.createAlert(error.response.data.message, "danger", 3000);
        });
    },
    addData() {
      this.user_id = "";
      this.user_name = "";
      this.username = "";
      this.role = "";
      this.action = "Add";
    },
    editData(user) {
      this.user_id = user.user_id;
      this.user_name = user.user_name;
      this.username = user.username;
      this.role = user.role;
      this.action = "Edit";
    },
    saveData() {
      let form = {
        user_name: this.user_name,
        username: this.username,
        role: this.role,
      };
      let headers = authHeader();

      if (this.action == "Add") {
        axios
          .post(this.baseURL, form, { headers })
          .then((response) => {
            this.showModal = false;
            this.createAlert(response.data.message, "success", 1500);
            this.getData();
          })
          .catch((error) => {
            this.createAlert(error.response.data.message, "danger", 3000);
          });
      } else {
        axios
          .put(this.baseURL + this.user_id, form, { headers })
          .then((response) => {
            this.showModal = false;
            this.createAlert(response.data.message, "success", 1500);
            this.getData();
          })
          .catch((error) => {
            this.createAlert(error.response.data.message, "danger", 3000);
          });
      }
    },
    deleteData() {
      let headers = authHeader();
      axios
        .delete(this.baseURL + this.user_id, { headers })
        .then((response) => {
          this.showDialog = false;
          this.createAlert(response.data.message, "success", 1500);
          this.getData();
        })
        .catch((error) => {
          this.createAlert(error.response.data.message, "danger", 3000);
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
