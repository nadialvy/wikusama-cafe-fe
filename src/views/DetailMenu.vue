<script setup>
    import Sidebar from '../components/Sidebar.vue';
    import Navbar from '../components/Navbar.vue';
    import axios from 'axios';
    import authHeader from '../services/auth-header.js';
    import { createToast } from 'mosha-vue-toastify';
    import 'mosha-vue-toastify/dist/style.css';
</script>

<template>
    <div class="flex h-screen">
        <Sidebar />
        <Navbar />
        <main class="flex-1 bg-orange-50 p-8 mt-16">
            <div v-if="loading">
                <img src="../assets/loading.gif" alt="Loading..." class="mx-auto my-auto w-20 py-56">
            </div>
            <div v-else>
                <div class="flex justify-center items-start mt-8 gap-x-10">
                    <div class="w-1/3">
                        <img :src="'http://127.0.0.1:8000/images/' + menu.menu_image_name" alt="menu-img" class="rounded-xl">
                    </div>
                    <div class="w-2/3">
                        <h1 class="text-4xl text-blue-300 font-bold">{{ menu.menu_name }}</h1>
                        <p class="mt-4 text-gray-500 font-light">{{ menu.menu_description }}</p>
                        <div class="border-t-2 my-4 border-orange-200"></div>

                        <div class="flex justify-between items-center">
                            <div class="flex gap-x-10">
                                <div class="flex items-center">
                                    <img src="../assets/love.svg" class="hover:cursor-pointer" />
                                    <p class="text-blue-300 ml-2">Like</p>
                                </div>
                                <div class="flex items-center">
                                    <img src="../assets/comment.svg" class="hover:cursor-pointer" />
                                    <p class="text-blue-300 ml-2">Comment</p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <img src="../assets/share.svg" />
                                <p class="text-orange-500 ml-2">99 Share</p>
                            </div>
                        </div>

                        <div class="border-t-2 my-4 border-orange-200"></div>
                        <div class="flex justify-start gap-x-7 my-6">
                            <button class="border border-orange-500 hover:bg-orange-500 rounded-full font-light text-orange-500 hover:text-white text-sm px-8 py-1" @click="showModal = true" v-on:click="editData(menu)">Edit Menu</button>
                            <button class="border border-orange-500 hover:bg-orange-500 rounded-full font-light text-orange-500 hover:text-white text-sm px-8 py-1" @click="showImageModal = true"  v-on:click="editImage(menu)">Edit Image</button>
                            <button @click="showConfirmDialog = true" class="border border-orange-500 font-light hover:bg-orange-500 text-orange-500 hover:text-white text-sm px-8 py-1 rounded-full">Delete Menu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- delete dialog -->
            <div>
                <div v-if="showConfirmDialog" class="fixed inset-0 z-50">
                    <div class="absolute inset-0 bg-black opacity-50" @click="showConfirmDialog = false"></div>
                    <div class="top-80 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                        <p class="text-base font-medium">Are you sure you want to delete this?</p>
                        <div class="flex justify-end mt-4">
                            <button @click="showConfirmDialog = false" class="bg-gray-300 hover:bg-gray-600 py-1 px-10 text-gray-700 hover:text-white rounded-lg mr-4">Cancel</button>
                            <button @click="deleteItem" class="border border-orange-500 hover:bg-orange-500 hover:text-white py-1 px-10 text-orange-500 rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- edit menu modal -->
            <div v-if="showModal" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black opacity-50" @click="showModal = false"></div> <!-- buat bg menghitam-->
                <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                    <div class="flex justify-between mb-6">
                        <p class="font-bold text-xl">Edit Menu</p>
                        <button @click="showModal = false" class="text-2xl font-medium">x</button>
                    </div>
                    <!-- form start here -->
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium">Menu Name</label>
                        <input  @keyup.enter="saveData()" type="text" v-model="name" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: Grilled Potato..." required>
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
                    <button v-on:click="saveData()" class="text-sm mt-4 mx-auto text-white bg-orange-500 py-2  w-full rounded-lg hover:bg-orange-600">Edit Menu</button>
                </div>
            </div>

            <!-- edit image modal -->
            <div v-if="showImageModal" class="fixed inset-0 z-50">
                <div class="absolute inset-0 bg-black opacity-50" @click="showImageModal = false"></div> <!-- buat bg menghitam-->
                <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto">
                    <div class="flex justify-between mb-6">
                        <p class="font-bold">Edit Image</p>
                        <button @click="showImageModal = false">x</button>
                    </div>
                    <!-- form start here -->
                    <div>
                        <input type="file" ref="file" @change="onFileChange" class="mb-4 border text-sm rounded-lg block w-full p-2.5" required>
                    </div>
                    <button v-on:click="saveImage()" class="text-sm mt-4 mx-auto text-white bg-orange-500 py-2  w-full rounded-lg hover:bg-orange-600">Edit Image</button>
                </div>
            </div>
        </main>
    </div>
</template>

<style>
.rounded-xl {
  border-radius: 1rem;
}
</style>

<script>
    export default{
        data(){
            return{
                baseUrl: 'http://127.0.0.1:8000/api/',
                // modal and ui
                showModal: false,
                showImageModal: false,
                showConfirmDialog: false,

                // data
                menu:{},
                loading: true,

                // form
                menu_id: "",
                name: "",
                type: "",
                description: "",
                price: "",
                menu_image: "",
            }
        },
        mounted(){
            this.getData();
        },
        methods:{
            deleteItem() {
                let headers = authHeader();
                axios.delete(this.baseUrl + 'menu/' + this.$route.params.id, { headers }).then((response) => {
                    this.createAlert(response.data.message, 'success', 1500)
                    setTimeout(() => {
                        this.$router.push('/menu').then(() => {
                            location.reload();
                        });
                    }, 1500);
                }).catch((error) => {
                    this.createAlert(error.response.data.message, 'danger', 3000);
                });

            },
            getData(){
                let headers = authHeader();
                axios.get(this.baseUrl + 'menu/'+this.$route.params.id, { headers }).then(response => {
                    this.menu = response.data.data;
                    console.log(this.menu);
                    this.loading = false;
                });
            },
            editData(menu){
                this.menu_id = menu.menu_id
                this.name = menu.menu_name
                this.type = menu.type
                this.description = menu.menu_description
                this.price = menu.price
            },
            onFileChange(e) {
                this.menu_image = e.target.files[0];
            },
            saveData(){
                let form = new FormData();
                form.append('menu_name', this.name);
                form.append('type', this.type);
                form.append('menu_description', this.description);
                form.append('price', this.price);

                let headers = { ...authHeader(), 'Content-Type': 'application/json' };

                axios.put(this.baseUrl + 'menu/' + this.menu_id, form, {headers}).then(response => {
                    this.menu = response.data.data;
                    this.getData();
                    this.showModal = false;
                    this.createAlert(response.data.message, 'success', 1500);
                }).catch((error) => {
                    this.showModal = false;
                    this.createAlert(error.response.data.message, 'danger', 3000)
                });
            },
            editImage(menu){
                this.menu_id = menu.menu_id
            },
            saveImage(){
                let form = new FormData();
                form.append('menu_image', this.menu_image);

                let headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };

                axios.post(this.baseUrl + 'menuimage/' + this.menu_id, form, { headers }).then((response) => {
                    this.menu = response.data.data;
                    this.showImageModal = false;
                    this.createAlert(response.data.message, 'success', 1500);
                    this.getData();
                }).catch((error) => {
                    this.createAlert(error.response.data.message, 'danger', 3000);
                })
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