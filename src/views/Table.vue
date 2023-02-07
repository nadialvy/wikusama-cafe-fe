<script setup>
    import Sidebar from '../components/Sidebar.vue';
    import Navbar from '../components/Navbar.vue';
    import TableComponent from '../components/TableComponent.vue';
    import axios from 'axios';
    import { createToast } from 'mosha-vue-toastify';
    import 'mosha-vue-toastify/dist/style.css';
    import _ from 'lodash';
    import authHeader from '../services/auth-header.js';
</script>

<template>
  <div class="flex bg-orange-50 w-full">
    <Sidebar />
    <Navbar />
    <main class="w-10/12 flex-1 bg-orange-50 p-8 mt-20">

        <div class="flex justify-between items-center">
            <div class="flex justify-start items-center">
            <div class="border-2 border-orange-300 text-blue-300 font-semibold text-5xl w-50 rounded-sm px-4 py-2"></div>
            <p class="ml-4 text-blue-300 mr-10">Available table</p>
            <div class="border-2 border-orange-300 bg-orange-200 text-blue-300 text-opacity-50 font-semibold text-5xl w-50 rounded-sm px-4 py-2"></div>
                <p class="ml-4 text-blue-300">Unavailable table</p>
            </div>
            <div>
                <button v-if="userRole === 'admin'" class="bg-orange-400 px-10 py-2 text-white text-sm rounded-2xl hover:bg-orange-500 hover:text-white" v-on:click="resetForm()" @click="showModal = true">Add Table</button>
            </div>
        </div>

        <!-- table section -->
        <div v-if="loading">
          <img src="../assets/loading.gif" alt="Loading..." class="mx-auto my-auto w-20 py-56">
        </div>
        <div v-else>
          <div v-auto-animate class="flex flex-wrap justify-center items-center gap-x-10 mt-10">
            <div v-for="(table, i) in tables" :key="i" >
              <TableComponent v-bind:isAva="table.is_available" v-bind:tableNumber="table.table_number" />
            </div>
          </div>
        </div>

        <!-- add table modal -->
        <div v-if="showModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black opacity-50" @click="showModal = false"></div> <!-- buat bg menghitam-->
            <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                <div class="flex justify-between mb-6">
                    <p class="font-bold text-xl">Add Table</p>
                    <button @click="showModal = false" class="text-2xl font-medium">x</button>
                </div>
                <!-- form start here -->
                <div>
                    <label for="table_number" class="block mb-2 text-sm font-medium">Table Number</label>
                    <input @keyup.enter="addData()" type="number" v-model="table_number" class="mb-4 border text-sm rounded-lg block w-full p-2.5" required>
                </div>
                <button v-on:click="addData()" class="border border-orange-500 hover:bg-orange-500 hover:text-white py-1 px-10 text-orange-500 rounded-lg w-full">Add Table</button>
            </div>
        </div>
      </main>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                baseUrl: 'http://127.0.0.1:8000/api/',
                // modal
                showModal: false,

                // get data
                tables: [],
                loading: true,

                // form
                table_number: "",

                // search
                searchKey: "",
                notFound: false,

                userRole: "",
            }
        },
        mounted(){
            this.getData();
            this.userRole = this.$store.state.auth.user.user.role;
        },
        watch: {
            searchKey: _.debounce(function(newVal){
                if(newVal.length > 0){
                    this.notFound = false;
                    let headers = authHeader();

                    axios.get(this.baseUrl + 'table/search/' + this.searchKey, { headers }).then((response) => {
                        this.notFound = false;
                        this.tables = response.data.data;
                    }).catch((error) => {
                        this.notFound = true;
                        this.tables = [];
                    })
                }else {
                    this.notFound = false;
                    this.getData();
                }
            })
        },
        methods: {
            // search
            search(){
                let headers = authHeader();
                axios.get(this.baseUrl + 'table/search/' + this.searchKey, { headers }).then((response) => {
                    this.tables = response.data.data;
                })
            },

            // crud
            getData(){
                this.searchKey = "";
                let headers = authHeader();
                axios.get(this.baseUrl + 'table', { headers }).then(response => {
                    this.tables = response.data;
                    this.loading = false;
                });
            },
            resetForm(){
                this.table_number = "";
            },
            addData(){
                let form = {
                    'table_number': this.table_number,
                }
                let headers = authHeader();

                axios.post(this.baseUrl + 'table', form, { headers } ).then(response => {
                    this.getData();
                    this.showModal = false;
                    this.createAlert(response.data.message, 'success', 1500);
                }).catch((error) => {
                   this.createAlert(error.response.data.message, 'danger', 3000);
                });
            },
            createAlert(message, type, timeout){
                createToast(message, {
                    position: 'bottom-center',
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
            }
        }
    }
</script>