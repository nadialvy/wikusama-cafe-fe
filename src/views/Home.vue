<script setup>
import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import axios from "axios";
import authHeader from "../services/auth-header.js";
import BestSellerCard from "../components/BestSellerCard.vue";
</script>

<template>
  <div class="flex bg-orange-50 w-full">
    <Sidebar />
    <Navbar />
    <main class="flex-1 p-8 mt-20">
      <div v-if="loading">
        <img
          src="../assets/loading.gif"
          alt="Loading..."
          class="mx-auto my-auto w-20 py-56"
        />
      </div>
      <div v-else>
        <p class="font-semibold text-xl text-blue-300 mb-4">Dashboard</p>
        <div class="flex flex-wrap justify-start gap-x-10 items-start">
          <div class="bg-orange-200 hover:bg-orange-300 rounded-lg pr-10 pl-4 py-4 transition-colors duration-300">
            <p class="text-blue-300 font-bold text-lg">Today's Total Order:</p>
            <p class="text-red-500 font-semibold">{{ todayData.totalOrder }}</p>
          </div>
          <div class="bg-orange-200 hover:bg-orange-300 rounded-lg px-12 pr-10 pl-4 py-4 transition-colors duration-300">
            <p class="text-blue-300 font-bold text-lg">Today's Revenue:</p>
            <p class="text-red-500 font-semibold">Rp{{ todayData.revenue }}</p>
          </div>
          <div class="bg-orange-200 hover:bg-orange-300 rounded-lg pr-10 pl-4 py-4 transition-colors duration-300">
            <p class="text-blue-300 font-bold text-lg">This Week Total Order:</p>
            <p class="text-red-500 font-semibold">{{ thisWeekData.totalOrder }}</p>
          </div>
          <div class="bg-orange-200 hover:bg-orange-300 rounded-lg px-12 pr-10 pl-4 py-4 transition-colors duration-300">
            <p class="text-blue-300 font-bold text-lg">This Week Revenue:</p>
            <p class="text-red-500 font-semibold">Rp{{ thisWeekData.revenue }}</p>
          </div>
        </div>
        <div class="py-10 flex">
          <div class="bg-orange-200 rounded-lg w-1/2 mx-auto">
            <canvas id="bestSellerChart"></canvas>
          </div>
          <div class="w-1/2">
            <div class="flex flex-wrap justify-evenly gap-x-4 gap-y-4 items-start pt-10">
              <div
                v-for="(menu, i) in bestSeller"
                :key="i"
                @click="goToMenuDetail(menu.menu_id)"
              >
                <BestSellerCard
                  v-bind:img="
                    'http://127.0.0.1:8000/images/' + menu.menu_image_name
                  "
                  v-bind:name="menu.menu_name"
                  v-bind:price="formatPrice(menu.price)"
                  v-bind:description="menu.menu_description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
export default {
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/api",
      loading: false,
      bestSeller: [],
      userData: {},

      todayData: [],
      thisWeekData: [],
    };
  },
  async mounted() {
    this.loading = true;
    this.getTodayData();
    this.getThisWeekData();
    this.userData = this.$store.state.auth.user.user;
    let headers = authHeader();
    await axios
      .get("http://127.0.0.1:8000/api/menu/show/bestseller", { headers })
      .then((response) => {
        this.bestSeller = response.data.data;
        this.loading = false;
      });

    const ctx = document.getElementById("bestSellerChart").getContext("2d");

    const bestSellerChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.bestSeller.map((item) => item.menu_name),
        datasets: [
          {
            barPercentage: 0.8,
            borderSkipped: "bottom",
            borderRadius: 5,
            categoryPercentage: 1,
            label: "sold",
            data: this.bestSeller.map((item) => item.quantity),
            backgroundColor: [
              "#EA6A12",
              "#41527C",
              "#B84784",
              "#E4475A",
              "#2F4858",
              "#41527C",
            ],
            borderColor: [
              "#ffffff",
              "#ffffff",
              "#ffffff",
              "#ffffff",
              "#ffffff",
              "#ffffff",
            ],
            borderWidth: 1.1,
          },
        ],
      },
      options: {
        scales: {
          // y: {
          //     beginAtZero: true
          // }
        },
        layout: {
          padding: {
            // bottom: 50,
            // top: 50,
          },
        },
      },
    });
    bestSellerChart;

  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      });
    },
    goToMenuDetail(id) {
      this.$router.push({ path: `/menu/${id}` });
    },
    getTodayData() {
      let headers = authHeader();
      axios.get(this.baseUrl + "/todaydata", { headers }).then((response) => {
        this.todayData = response.data.data;
      });
    },
    getThisWeekData() {
      let headers = authHeader();
      axios.get(this.baseUrl + "/weekdata", { headers }).then((response) => {
        this.thisWeekData = response.data.data;
        console.log(this.thisWeekData);
      });
    },
  },
};
</script>
