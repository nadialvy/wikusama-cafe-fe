<script setup>
import axios from "axios";
import authHeader from "../services/auth-header.js";
</script>

<template>
  <div v-if="loading">
    <img src="../assets/loading.gif" class="mx-auto my-auto mt-40 w-20 py-56" />
  </div>
  <div v-else>
    <div class="h-screen">
      <div class="mx-auto my-auto invoice uppercase">
        <div class="text-center">
          <p class="text-4xl">INVOICE</p>
          <p class="text-lg">Wikusama Cafe</p>
        </div>
        <div class="text-start">
          <p>
            ORDER #{{ orderDetail[0].order_id }}/{{
              orderDetail[0].order_detail_id
            }}
            FOR {{ orderDetail[0].customer_name }}
          </p>
          <p>{{ orderDetail[0].order_date }}</p>
        </div>

        <div class="border border-gray-800"></div>
        <div class="flex flex-col">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full text-center">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4"
                      >
                        NAME
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4"
                      >
                        QTY
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4"
                      >
                        PRICE
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4"
                      >
                        SUBTOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(data, i) in orderDetail" :key="i">
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                      >
                        {{ i + 1 }}
                      </td>
                      <td
                        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                      >
                        {{ data.menu_name }}
                      </td>
                      <td
                        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                      >
                        {{ data.quantity }}
                      </td>
                      <td
                        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                      >
                        Rp{{ data.price }}
                      </td>
                      <td
                        class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap"
                      >
                        Rp{{ data.order_detail_price }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- total section -->
        <div class="border border-gray-800"></div>
        <div class="px-6 py-2">
          <p class="">
            TOTAL
            <span class="font-bold"> Rp{{ this.totalPrice }}</span>
          </p>
        </div>
        <div class="border border-gray-800 mb-2"></div>

        <!-- dummy -->
        <P>CASHIER: {{orderDetail[0].username}}</P>
        <p>CARD: #*** * ***</p>
        <p class="text-center">THANK YOU FOR YOUR VISIT</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // data detail order
      orderDetail: [],
      totalPrice: "",
      loading: true,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let headers = authHeader();
      axios
        .get("http://127.0.0.1:8000/api/orderdetail/" + this.$route.params.id, {
          headers,
        })
        .then((response) => {
          this.orderDetail = response.data.data;
          this.totalPrice = response.data.total_price;
          this.loading = false;
        });
    },
  },
  watch: {
    loading: function (newVal) {
      if (newVal === false) {
        setTimeout(() => {
          window.print();
        }, 300);
      }
    },
  },
};
</script>
