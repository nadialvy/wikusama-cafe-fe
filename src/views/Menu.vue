<script setup>
    import Sidebar from '../components/Sidebar.vue';
    import Navbar from '../components/Navbar.vue';

</script>

<template>
    <div class="flex h-screen">
        <Sidebar />
        <Navbar />
        <main class="flex-1 bg-orange-50 p-8 mt-16">
            <div class="pb-8 flex justify-between items-center">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </span>
                    <input type="text" class="pl-12 py-2 rounded-3xl text-gray-500 bg-white border placeholder:font-light placeholder:text-sm border-gray-200 focus:outline-none focus:bg-white" placeholder="Search...">
                </div>
                <button v-on:click="getData()" @click="handleAllClick" :class="[!isAllClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white">All</button>
                <button v-on:click="getDataFood()" @click="handleFoodClick" :class="[!isFoodClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white">Food</button>
                <button v-on:click="getDataDrink()" @click="handleDrinkClick" :class="[!isDrinkClicked ? 'border-orange-300 text-orange-300' : 'bg-orange-300 text-white']" class="border px-10 py-1 text-sm rounded-2xl hover:bg-orange-300 hover:text-white mr-96">Drink</button>
                <button class="bg-orange-500 px-10 py-2 text-white text-sm rounded-2xl hover:bg-orange-600" v-on:click="resetForm()" @click="showModal = true">Add Menu +</button>
            </div>
        <h3 class="text-lg font-medium mb-4">Menu</h3>
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
        methods: {
            // get data from api
            getData(){
                let headers = authHeader();

                this.searchKey = "";
                axios.get(this.baseUrl, { headers }).then(response => {
                    this.menus = response.data.data;
                    this.loading = false;
                });
            },
        }
    };
</script>