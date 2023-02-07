<script setup>
  import Sidebar from '../components/Sidebar.vue';
  import Navbar from '../components/Navbar.vue';
  import authHeader from '../services/auth-header.js';
  import axios from 'axios'
  import { createToast } from 'mosha-vue-toastify';
  import 'mosha-vue-toastify/dist/style.css';
  import _ from 'lodash';
  import DatePicker from '@jobinsjp/vue3-datepicker';
  import '@jobinsjp/vue3-datepicker/index.css';
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <Navbar />
    <main class="w-10/12 flex-1 bg-orange-50 p-8 mt-16">

      <!-- search and add button -->
      <div class="pt-8 flex justify-between items-center">
          <div class="flex items-center justify-start gap-x-4" v-if="userRole === 'manager'">
              <div class="flex border-2 border-orange-500 rounded">
                  <input :disabled="isSearchDisabled" @click="handleSearch" @keyup.enter="search()" v-model="searchKey" type="text" class="px-4 text-sm opacity-70 placeholder-customBlack" placeholder="Search...">
                  <button class="bg-orange-500" @click="searchKey = ''">
                      <p class="m-1 text-white font-semibold">x</p>
                  </button>
              </div>
              <date-picker @click="handleDatepicker" :disabled="isDatepickerDisabled" v-model:value="date" valueType="format" placeholder="Select date"></date-picker>
              <date-picker @click="handleMonthpicker" :disabled="isMonthpickerDisabled" v-model:value="month" valueType="format" type="month" placeholder="Select month"></date-picker>
          </div>
          <button v-on:click="resetForm()" @click="getDataModal()" class="bg-orange-500 px-10 py-2 text-white text-sm rounded-xl hover:bg-orange-600">Add Order +</button>
      </div>

        <!-- table section -->
        <div v-if="loading">
            <img src="../assets/loading.gif" alt="Loading..." class="mx-auto w-20 my-20">
        </div>
        <div v-else>
            <div class="flex flex-col pb-20">
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <table class="min-w-full">
                            <thead class="bg-transparent border-b">
                                <tr class="text-center">
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">#</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Date</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Staff</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Customer Name</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Payment Status</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Table</th>
                                    <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(order, i) in orders" :key="i" class="bg-transparent border-b transition duration-300 text-center ease-in-out hover:bg-gray-100">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i+1 }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-10 whitespace-nowrap">{{ order.order_date }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ order.user_name }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ order.customer_name }}</td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        <div v-if="order.status !== 'paid'" class="relative">
                                            <button @click="order.showDropdown = !order.showDropdown" class="px-6 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-full">
                                                {{ order.status }} ▼
                                            </button>
                                            <div v-if="order.showDropdown" class="hover:cursor-pointer absolute border border-gray-400 z-10 bg-white rounded-lg py-2 w-40">
                                                <p @click="updatePayment(order.order_id)" :value="paid" class="block px-6 text-black hover:text-green-500 font-semibold">Paid</p>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <button class="px-6 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-full">
                                                {{ order.status }}
                                            </button>
                                        </div>
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {{ order.table_number }}
                                    </td>
                                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap hover:cursor-pointer">
                                        <div class="flex justify-between items-center hover:cursor-pointer">
                                            <div v-if="order.status === 'pending'">
                                                <img @click="getEditModal(order)" src="../assets/edit.png" class="w-5 h-5" alt="Edit">
                                            </div>
                                            <div v-if="order.status === 'paid'">
                                                <img @click="showOrderDetail(order.order_id)" v-on:click="getOrderDetail(order.order_id)" src="../assets/list.png" alt="detail" class="w-6 h-6">
                                            </div>
                                            <img @click="showConfirmDialog(order.order_id)" src="../assets/delete.png" alt="Delete" class="w-5 h-5">
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
                        <button @click="showDialog = false" class="bg-gray-300 py-1 px-10 text-gray-700 rounded-sm mr-4">Cancel</button>
                        <button @click="deleteData(order_id)" class="bg-primaryRed hover:bg-hoverPrimaryRed py-1 px-10 text-white rounded-sm">Delete</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- order detail information modal -->
          <div v-if="showOrderDetailModal" class="fixed inset-0 z-50">
              <div class="absolute inset-0 bg-black opacity-50" @click="showOrderDetailModal = false"></div>
              <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-5xl md:h-auto">
                  <!-- <p>{{orderDetail}}</p> -->
                  <table class="min-w-full">
                    <thead class="bg-transparent border-b">
                        <tr class="text-center">
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">No</th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Name</th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Qty</th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Price</th>
                            <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(dt, i) in orderDetail" :key="i" class="bg-transparent border-b transition duration-300 text-center ease-in-out hover:bg-gray-100">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i+1 }}</td>
                            <td class="text-sm text-gray-900 font-light px-6 py-10 whitespace-nowrap">{{ dt.menu_name }}</td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{{ dt.quantity }}</td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Rp{{ dt.price }}</td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">Rp{{ dt.price * dt.quantity }}</td>
                        </tr>
                    </tbody>
                  </table>
                  <p class="mt-4 font-bold text-orange-500">Sub total: Rp{{totalPrice}}</p>
                  <button @click="goToInvoice(this.order_id)" class="border border-orange-500 py-1 px-10 text-orange-500 rounded-lg w-full hover:bg-orange-500 hover:text-white mt-4">Print Invoice</button>
              </div>
          </div>

        <!-- add edit menu modal -->
        <div v-if="showModal" class="fixed inset-0 z-50">
            <div class="absolute inset-0 bg-black opacity-50" @click="showModal = false"></div>
            <div class="top-10 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-3xl md:h-auto">
                <div class="flex justify-between mb-6">
                    <p class="font-bold text-xl">{{ action }} Order</p>
                    <button @click="showModal = false" class="text-2xl font-medium">x</button>
                </div>
                <div class="overflow-y-scroll h-[560px]">
                    <!-- modal content goes here -->
                    <div v-if="loading">
                        <img src="../assets/loading.gif" alt="Loading..." class="mx-auto w-12 h-12">
                    </div>
                    <div v-else>
                        <div class="px-4">
                            <div>
                                <label for="staff" class="block mb-2 text-sm font-medium">Staff Name</label>
                                <select v-model="user_id" class="mb-4 border text-sm rounded-lg block w-full p-2.5">
                                    <option value="" disabled>Select the Staff Name</option>
                                    <option v-for= "(cashier, i) in cashiers" :key="i" :value="cashier.user_id">{{ cashier.user_name }}</option>
                                </select>
                            </div>
                            <div>
                                <label for="tableNumber" class="block mb-2 text-sm font-medium">Table Number</label>
                                <select v-model="table_id" class="mb-4 border text-sm rounded-lg block w-full p-2.5">
                                    <option value="" disabled>Available table number</option>
                                    <option v-for= "(table, i) in availTables" :key="i" :value="table.table_id">{{ table.table_number }}</option>
                                </select>
                            </div>
                            <div>
                                <label for="customerName" class="block mb-2 text-sm font-medium">Customer Name</label>
                                <input type="text" v-model="customerName" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: Aditya Pratama" required>
                            </div>
                            <div class="border-t-4 border-orange-500"></div>

                            <!-- detail order section -->
                            <div class="flex justify-between items-center mt-10">
                                <p class="font-bold text-xl">Detail Order</p>
                                <button @click="addMenu" class="bg-orange-500 text-xl px-2 rounded-sm text-white hover:bg-orange-600">+</button>
                            </div>
                            <div class="border-t-2 my-4"></div>
                            <div v-for="(detail, counter) in detailMenu" :key="counter">
                                <div v-if="this.action === 'Edit'">
                                    <input type="hidden" v-model="detail.order_detail_id">
                                </div>
                                <div class="flex justify-between items-center">
                                    <p class="text-orange-500 font-bold text-sm">Menu {{ counter + 1}}</p>
                                    <button @click="deleteMenu(counter)" class="text-xl px-2 text-white rounded-sm bg-red-500 hover:bg-red-600">-</button>
                                </div>
                                <div class="flex justify-between items-center">
                                    <div>
                                        <label for="menu_id" class="block mb-2 text-sm font-medium">Menu Name - Price</label>
                                        <select v-model="detail.menu_id" class="mb-4 border text-sm rounded-lg block w-full p-2.5">
                                            <option value="" disabled>Select menu</option>
                                            <option v-for= "(menu, i) in menus" :key="i" :value="menu.menu_id">{{ menu.menu_name }} - Rp{{ menu.price }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label for="quantity" class="block mb-2 text-sm font-medium">Quantity</label>
                                        <input type="number" v-model="detail.quantity" class="mb-4 border text-sm rounded-lg block w-full p-2.5" placeholder="ex: 2" required>
                                    </div>
                                </div>
                                <div class="border-t-2 mt-4 mb-6 border-blur-300"></div>
                            </div>
                            <button v-on:click="saveData()" class="text-sm mt-4 mx-auto text-orange-500 border border-orange-500 py-2 w-full rounded-lg hover:bg-orange-500 hover:text-white">{{ action }} Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  </div>
</template>


<script>
export default{
  data(){
    return{
        baseUrl: 'http://127.0.0.1:8000/api',
        url: '',
        // modal and ui
        showModal: false,
        action: '',
        showDropdown: false,
        showDialog: false,
        showOrderDetailModal: false,

        // get data
        orders: [],
        cashiers: [],
        availTables:[],
        menus:[],
        loading: true,

        // update status
        status: '',

        // v-model/form
        user_id: '', //staff
        table_id: '', //tableNumber
        customerName: '',
        detailMenu: [],

        // delete data
        order_id: '',

        // order detail
        orderDetail: [],
        totalPrice: '',

        // search and filter
        searchKey: '',
        notFound: '',
        isSearchDisabled: false,
        isDatepickerDisabled: false,
        isMonthpickerDisabled: false,
        date: null,
        month: null,

        userRole: '',
    }
  },
  mounted(){
    this.getData();
    this.userRole = this.$store.state.auth.user.user.role;
  },
  created() {
    let url = '';
    this.userRole = this.$store.state.auth.user.user.role;
    if(this.userRole === 'cashier'){
      url = this.baseUrl + '/order/' + this.$store.state.auth.user.user.user_id;
    }else{
      url = this.baseUrl + '/order';
    }

    let headers = authHeader();
    axios.get(url, { headers }).then(response => {
      this.orders = response.data.map(order => {
          return {
              ...order,
              showDropdown: false
          }
      })
    }).catch((error) => {
      // console.log(error);
      // this.createAlert(error, 'danger', 3000);
    });
  },
  watch:{
    searchKey: _.debounce(function(newVal){
        if(newVal.length > 0){
            this.notFound = false;
            this.isDatepickerDisabled = true;
            this.isMonthpickerDisabled = true;

            let headers = authHeader();

            axios.get(this.baseUrl + '/order/search/' + newVal, { headers }).then(response => {
                this.orders = response.data.data;
            }).catch((error) => {
                this.notFound = true;
                this.orders = [];
                this.createAlert(error.response.data, 'danger', 3000);
            });
        }else{
            this.isDatepickerDisabled = false;
            this.isMonthpickerDisabled = false;
            this.notFound = false;
            this.getData();
        }
    }),
    // watch date
    date: _.debounce(function(newVal){
        if(newVal !== null){
            this.notFound = false;
            this.isMonthpickerDisabled = true;
            this.isSearchDisabled = true;

            let headers = authHeader();

            axios.get(this.baseUrl + '/order/searchbydate/' + newVal, { headers }).then(response => {
                this.orders = response.data.data;
            }).catch((error) => {
                this.notFound = true;
                this.orders = [];
                this.createAlert(error.response.data, 'danger', 3000);
            });
        }else{
            this.isMonthpickerDisabled = false;
            this.isSearchDisabled = false;
            this.notFound = false;
            this.getData();
        }
    }),
    month: _.debounce(function(newVal){
        if(newVal !== null){
            this.notFound = false;
            this.isSearchDisabled = true;
            this.isDatepickerDisabled = true;
            let headers = authHeader();

            axios.get(this.baseUrl + '/order/searchbymonth/' + newVal, { headers }).then(response => {
                this.orders = response.data.data;
            }).catch((error) => {
                this.notFound = true;
                this.orders = [];
                this.createAlert(error.response.data, 'danger', 3000);
            });
        }else{
            this.isSearchDisabled = false;
            this.isDatepickerDisabled = false;
            this.notFound = false;
            this.getData();
        }
    })
  },
  methods:{
    // search and filtering
    handleSearch(){
      this.isMonthpickerDisabled = true;
      this.isDatepickerDisabled = true;
      this.date = null;
      this.month = null;
    },
    handleDatepicker(){
      this.isSearchDisabled = true;
      this.isMonthpickerDisabled = true;
      this.searchKey = '';
      this.month = null;
    },
    handleMonthpicker(){
      this.isSearchDisabled = true;
      this.isDatepickerDisabled = true;
      this.searchKey = '';
      this.date = null;
    },
    // ui detail
    showOrderDetail(order_id){
        this.order_id = order_id;
        this.showOrderDetailModal = true;
    },
    // function detail
    getOrderDetail(order_id){
      let headers = authHeader();
      axios.get(this.baseUrl + '/orderdetail/' + order_id, { headers }).then((response) => {
        console.log('halo');
        console.log(response.data.total_price);
        this.orderDetail = response.data.data;
        this.totalPrice = response.data.total_price;
      }).catch((error) => {
        this.createAlert(error.response.data, 'danger', 3000);
      });
    },
    // ui delete
    showConfirmDialog(order_id){
        this.order_id = order_id;
        this.showDialog = true;
    },
    // function delete
    deleteData(){
      let headers = authHeader();
      axios.delete(this.baseUrl + '/order/' + this.order_id, { headers }).then((response) => {
          this.showDialog = false;
          this.createAlert(response.data.message, 'success', 1500);
          this.getData();
      }).catch((error) => {
          this.createAlert(error.response.data, 'danger', 3000);
      });
    },
    // data table
    getData(){
      let url = '';
      this.userRole = this.$store.state.auth.user.user.role;
      if(this.userRole === 'cashier'){
        url = this.baseUrl + '/order/' + this.$store.state.auth.user.user.user_id;
      }else{
        url = this.baseUrl + '/order';
      }

      let headers = authHeader();
      axios.get(url, { headers }).then(response => {
          this.orders = response.data.data;
          this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.createAlert(error.response.data, 'danger', 3000);
      });
    },
    // get basic data to modal ui
    getBasicData(){
      let headers = authHeader();
      axios.get(this.baseUrl + '/user/cashier', { headers } ).then(response => {
          this.cashiers = response.data.data;
      }).catch((error) => {
          this.createAlert(error.response.data, 'danger', 3000);
      });

      axios.get(this.baseUrl + '/menu', { headers } ).then(response => {
          this.menus = response.data.data;
      }).catch((error) => {
          this.createAlert(error.response.data, 'danger', 3000);
      });

      const url = this.action === 'Add'
      ? this.baseUrl + '/table/available'
      : this.baseUrl + '/table/availableedit/' + this.table_id;

      axios.get(url, { headers }).then(response => {
          this.availTables = this.action === 'Add'
              ? response.data
              : response.data.data;
          this.loading = false;
      }).catch((error) => {
          this.createAlert(error.response.data, 'danger', 3000);
      });
    },
    // modal add
    getDataModal(){
        this.showModal = true;
        this.action = 'Add',
        this.getBasicData();
    },

    // modal edit
    getEditModal(order){
        this.loading = true;
        let headers = authHeader();

        this.order_id = order.order_id;
        axios.get(this.baseUrl + '/detailmenu/' + this.order_id, { headers }).then((response) => {
            this.detailMenu = response.data.data;
        }).catch((error) => {
            this.createAlert(error.response.data, 'danger', 3000);
        });

        this.showModal = true;
        this.action = 'Edit';
        this.user_id = order.user_id;
        this.table_id = order.table_id;
        this.customerName = order.customer_name;
        this.getBasicData();
    },

    resetForm(){
        this.user_id = '',
        this.table_id = '',
        this.customerName = '',
        this.detailMenu = []
    },

    // function add and remove menu from modal
    addMenu(){
        this.detailMenu.push({
            menu_id: '',
            quantity: '',
        });
    },

    deleteMenu(counter){
        this.detailMenu.splice(counter, 1);
    },

    // store into database
    saveData(){
        let form = {
            'user_id': this.user_id,
            'table_id': this.table_id,
            'customer_name': this.customerName,
            'detail': this.detailMenu,
        };

        if (this.action === 'Edit') {
            form.order_id = this.order_id;
        }

        let headers = authHeader();

        if(this.action === 'Add'){
            axios.post(this.baseUrl + '/order', form, { headers }).then((response) => {
                this.showModal = false;
                this.createAlert(response.data.message, 'success', 1500);
                this.getData();
            }).catch((error) => {
                this.createAlert(error.response.message, 'danger', 3000);
            })
        }else{
            axios.put(this.baseUrl + '/order/' + this.order_id, form, { headers }).then((response) => {
                this.showModal = false;
                this.createAlert(response.data.message, 'success', 1500);
                this.getData();
            }).catch((error) => {
                this.createAlert(error.response.data, 'danger', 3000);
            })
        }
    },

    // ui update status
    togglePayment() {
        if(this.status != 'paid'){
            this.showDropdown = !this.showDropdown;
        };
    },

    // function update status
    updatePayment($order_id){
        let form = {
            'status': 'paid'
        };

        let headers = authHeader();

        axios.put(this.baseUrl + '/order/' + $order_id + '/status', form, { headers }).then((response) => {
            this.showDropdown = false;
            this.createAlert(response.data.message, 'success', 1500);
            this.getData();
        }).catch((error) => {
            this.createAlert(error.response.data, 'danger', 3000);
        });
    },

    // routing to invoice
    goToInvoice(id){
        window.open(`/invoice/${id}`,'_blank');
    },
    search(){
      let headers = authHeader();
      axios.get(this.baseUrl + 'search/' + this.searchKey, { headers }).then((response) => {
          this.orders = response.data.data;
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