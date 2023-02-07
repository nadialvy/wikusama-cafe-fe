<script setup>
    import axios from 'axios'
    import authHeader from '../services/auth-header.js';
</script>

<template>
    <div v-if="loading">
        <img src="../assets/loading.gif" class="mx-auto my-auto mt-80 w-32 py-56">
    </div>
    <div v-else>
        <div>
            <div class="mx-auto my-auto">
                <div class="bg-black">
                    <div class="px-6 py-8">
                        <!-- header section -->
                        <div class="flex justify-between items-start">
                            <div class="w-1/2">
                                <img src="../assets/WikusamaCafe.svg" alt="">
                                <div class="my-2">
                                    <p class="text-white text-sm text-opacity-75">+62 346 7835 43</p>
                                    <p class="text-white text-sm text-opacity-75">wikusamacafe@gmail.com</p>
                                    <p class="text-white text-sm text-opacity-75">www.wikusamainaja.com</p>
                                </div>
                            </div>
                            <div class="w-1/2">
                                <div class="text-white text-right text-sm">
                                    <p>4380 Sawojajar</p>
                                    <p>Malang</p>
                                    <p>0923832</p>
                                    <p>Indonesia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-100">
                    <!-- addressed section -->
                    <div class="flex justify-evenly items-start px-6 py-4">
                        <div class="w-1/3">
                            <p class="text-gray-700 text-sm">Billed to: </p>
                            <p class="font-semibold">{{ this.orderDetail[0].customer_name }}</p>
                            <p class="text-sm">3823 Arjosari</p>
                            <p class="text-sm">Blimbing</p>
                            <p class="text-sm">Malang</p>
                        </div>
                        <div class="w-1/3">
                            <p class="text-gray-500 text-sm text-center">Invoice Number</p>
                            <p class="text-sm text-center">#32837</p>
                            <p class="text-gray-500 text-sm mt-8 text-center">Invoice Date</p>
                            <p class="text-sm text-center">{{ this.orderDetail[0].order_date }}</p>
                        </div>
                        <div class="w-1/3">
                            <p class="text-gray-500 text-sm text-right">Invoice of(IDR)</p>
                            <p class="text-orange-500 font-semibold text-3xl text-right">Rp{{ this.totalPrice }}</p>
                            <p class="text-gray-500 text-sm text-right mt-4">Cashier :</p>
                            <p class="text-right text-sm">{{ this.orderDetail[0].user_name }}</p>
                        </div>
                    </div>
                    <div class="border-t-8 mb-2 mx-4 border-gray-400"></div>

                    <!-- item menu section -->
                    <div class="flex flex-col">
                        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                            <div class="overflow-hidden">
                                <table class="min-w-full text-center">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4"> # </th>
                                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Menu Name</th>
                                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Quantity</th>
                                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Price</th>
                                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">SubTotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(data, i) in orderDetail" :key="i">
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i + 1}}</td>
                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ data.menu_name }}</td>
                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ data.quantity }}</td>
                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Rp{{ data.price }}</td>
                                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Rp{{ data.order_detail_price }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>

                    <!-- total section -->
                    <div class="px-6 py-8">
                        <p class="text-right">Total: <span class="font-bold text-xl">Rp{{ this.totalPrice }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                // data detail order
                orderDetail: [],
                totalPrice: '',
                loading: true,
            }
        },
        created(){
            this.getData();
        },
        methods:{
            getData(){
                let headers = authHeader();
                axios.get('http://127.0.0.1:8000/api/orderdetail/' + this.$route.params.id, { headers }).then((response) => {
                    this.orderDetail = response.data.data;
                    this.totalPrice = response.data.total_price;
                    this.loading = false;
                })
            }
        },
        watch:{
            loading: function (newVal) {
                if (newVal === false) {
                    setTimeout(() => {
                        window.print();
                    }, 300);
                }
            }
        }
    }
</script>