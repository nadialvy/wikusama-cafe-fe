<script setup>
    import Sidebar from '../components/Sidebar.vue';
    import Navbar from '../components/Navbar.vue';
    import MenuCard from '../components/MenuCard.vue';
    import axios from 'axios';
    import { createToast } from 'mosha-vue-toastify';
    import 'mosha-vue-toastify/dist/style.css';
    import _ from 'lodash';
    import authHeader from '../services/auth-header.js';
</script>

<template>
    <div class="flex h-screen">
        <Sidebar />
        <Navbar />
        <main class="w-10/12 flex-1 bg-orange-50 p-8 mt-16">

            <!-- search and add button -->
            <div class="pb-8 flex justify-between items-center">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </span>
                    <input @keyup.enter="search()" v-model="searchKey" type="text" class="pl-12 py-2 rounded-3xl text-gray-500 bg-white border placeholder:font-light placeholder:text-sm border-gray-200 focus:outline-none focus:bg-white" placeholder="Search...">
                </div>
                <button v-on:click="getData()" @click="handleAllClick" :class="[!isAllClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white">All</button>
                <button v-on:click="getDataFood()" @click="handleFoodClick" :class="[!isFoodClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white">Food</button>
                <button v-on:click="getDataDrink()" @click="handleDrinkClick" :class="[!isDrinkClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white mr-96">Drink</button>
                <button class="bg-orange-500 px-10 py-2 text-white text-sm rounded-2xl hover:bg-orange-600" v-on:click="resetForm()" @click="showModal = true">Add Menu +</button>
            </div>

            <!-- list menu -->
            <div v-if="loading">
                <img src="../assets/loading.gif" alt="Loading..." class="mx-auto my-auto w-20">
            </div>
            <div v-else-if="notFound">
                <p class="text-center text-2xl font-bold mt-32 mb-44">Menu Not Found</p>
            </div>
            <div v-else>
                <div v-auto-animate class="flex flex-wrap justify-center items-start gap-x-9">
                    <div v-for="(menu, i) in menus" :key="i" @click="goToDetail(menu.menu_id)">
                        <MenuCard v-bind:img="'http://127.0.0.1:8000/images/' + menu.menu_image_name" v-bind:name="menu.menu_name" v-bind:price="menu.price.toString()"/>
                    </div>
                </div>
            </div>

            <!-- add menu modal -->
            <div v-if="showModal" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black opacity-50" @click="showModal = false"></div> <!-- buat bg menghitam-->
                <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                    <div class="flex justify-between mb-6">
                        <p class="font-bold text-xl">Add Menu</p>
                        <button @click="showModal = false" class="text-2xl font-medium">x</button>
                    </div>
                    <!-- form start here -->
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium">Menu Name</label>
                        <input type="text" v-model="name" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: Grilled Potato..." required>
                    </div>
                    <div>
                        <label for="type" class="block mb-2 text-sm font-medium">Type</label>
                        <select v-model="type" class="mb-4 border text-sm rounded-lg block w-full p-2.5">
                            <option value="food">Food</option>
                            <option value="drink">Drink</option>
                        </select>
                    </div>
                    <div>
                        <label for="description" class="block mb-2 text-sm font-medium">Description</label>
                        <textarea v-model="description" rows="4" class="mb-4 border -sm rounded-lg block w-full p-2.5 text-sm" placeholder="ex: Grilled Potato with tomato sauce and side dish..." required></textarea>
                    </div>
                    <div>
                        <label for="price" class="block mb-2 text-sm font-medium">Price</label>
                        <input type="number" v-model="price" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: Rp.55.000" required>
                    </div>
                    <div>
                        <label for="img" class="block mb-2 text-sm font-medium">Pict</label>
                        <input type="file" ref="file" @change="onFileChange" class="mb-4 border text-sm rounded-lg block w-full p-2.5" required>
                    </div>
                    <button v-on:click="addData()" class="text-sm mt-4 mx-auto text-white bg-orange-500 py-2  w-full rounded-sm hover:bg-orange-600">Add Menu</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                baseUrl: 'http://127.0.0.1:8000/api/menu/',
                url: '',

                // modal
                showModal: false,

                // get data
                menus: [],
                loading: true,

                // form
                id: "",
                name: "",
                type: "",
                description: "",
                price: "",
                menu_image: "",

                // search and filter
                searchKey: "",
                isAllClicked: false,
                isFoodClicked: false,
                isDrinkClicked: false,
                notFound: false,
            }
        },
        mounted () {
            this.getData();
        },
        watch:{
            searchKey: _.debounce(function(newVal){
                if(newVal.length > 0){
                    this.notFound = false;

                    if(this.isFoodClicked){
                        this.url = this.baseUrl + 'searchfood/' + this.searchKey;
                    }else if(this.isDrinkClicked){
                        this.url = this.baseUrl + 'searchdrink/' + this.searchKey;
                    }else{
                        this.url = this.baseUrl + 'search/' + this.searchKey;
                    }

                    let headers = authHeader();

                    axios.get(this.url, { headers }).then((response) => {
                        this.notFound = false;
                        this.menus = response.data.data;
                    }).catch((error) => {
                        this.notFound = true;
                        this.menus = [];
                    })
                }else {
                    if(this.isFoodClicked){
                        this.notFound = false;
                        this.getDataFood();
                    }else if(this.isDrinkClicked){
                        this.notFound = false;
                        this.getDataDrink();
                    }else{
                        this.notFound = false;
                        this.getData();
                    }
                }
            })
        },
        methods: {
            // filtering and search
            handleAllClick(){
                this.isAllClicked = !this.isAllClicked;
                this.isFoodClicked = false;
                this.isDrinkClicked = false;
            },
            handleFoodClick() {
                this.isFoodClicked = !this.isFoodClicked;
                this.isAllClicked = false;
                this.isDrinkClicked = false;
            },
            handleDrinkClick() {
                this.isDrinkClicked = !this.isDrinkClicked;
                this.isAllClicked = false;
                this.isFoodClicked = false;
            },
            search(){
                let headers = authHeader();
                axios.get(this.baseUrl + 'search/' + this.searchKey, { headers }).then((response) => {
                    this.menus = response.data.data;
                });
            },
            // get data from api
            getData(){
                let headers = authHeader();

                this.searchKey = "";
                axios.get(this.baseUrl, { headers }).then(response => {
                    this.menus = response.data.data;
                    this.loading = false;
                });
            },
            onFileChange(e) {
                this.menu_image = e.target.files[0];
            },
            resetForm(){
                this.name = "";
                this.type = "";
                this.description = "";
                this.price = "";
                this.menu_image = "";
            },
            addData(){
                let formData = new FormData();
                formData.append('menu_name', this.name);
                formData.append('type', this.type);
                formData.append('menu_description', this.description);
                formData.append('price', this.price);
                formData.append('menu_image_name', this.menu_image);

                let headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };

                axios.post(this.baseUrl, formData, { headers }).then((response) => {
                    this.getData();
                    this.showModal = false;
                    this.createAlert(response.data.message, 'success', 1500);
                }).catch((error) => {
                    this.createAlert(error.response.data.message, 'danger', 3000);
                })
            },
            goToDetail(id){
                this.$router.push({ path: `/menu/${id}`});
            },
            // button filtering
            getDataFood(){
                let headers = authHeader();
                this.searchKey = "";
                axios.get(this.baseUrl + 'show/food', { headers }).then((response) => {
                    this.menus = response.data.data;
                });
            },
            getDataDrink(){
                let headers = authHeader();
                this.searchKey = "";
                axios.get(this.baseUrl + 'show/drink', { headers }).then((response) => {
                    this.menus = response.data.data;
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
    };
</script>