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
    <main class="flex-1 p-8 mt-16">
      <div class="bg-dashboard">
        <div class="px-12 text-blue-300">
          <p class="font-bold text-xl">Welcome, {{ userData.username }}</p>
          <p>Look whats new in your restaurant here!</p>
        </div>
      </div>
      <div class="py-10">
        <h1 class="font-bold text-blue-300 text-3xl text-center">
          Top 6 Best Seller
        </h1>
        <h1 class="text-center text-orange-500 text-lg font-semibold mb-4">
          From Our Menu
        </h1>
        <div class="bg-orange-200 rounded-lg w-[650px] mx-auto">
          <canvas id="bestSellerChart"></canvas>
        </div>
        <div
          class="flex flex-wrap justify-center gap-x-8 gap-y-4 items-start pt-10"
        >
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
              v-bind:price="menu.price.toString()"
              v-bind:description="menu.menu_description"
            />
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
      bestSeller: [],
      userData: {},
    };
  },
  async mounted() {
    this.userData = this.$store.state.auth.user.user;
    let headers = authHeader();
    await axios
      .get("http://127.0.0.1:8000/api/menu/show/bestseller", { headers })
      .then((response) => {
        this.bestSeller = response.data.data;
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
    goToMenuDetail(id) {
      this.$router.push({ path: `/menu/${id}` });
    },
  },
};
</script>
