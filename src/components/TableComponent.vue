<script setup>
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import axios from "axios";
const props = defineProps({
  tableNumber: String,
  isAva: String,
});
import authHeader from "../services/auth-header.js";
</script>

<template>
  <div>
    <div
      v-if="isAva == 'true'"
      class="border-4 border-orange-300 w-50 rounded-lg p-8"
    >
      <p class="text-center text-blue-300 font-semibold text-3xl truncate">
        {{ tableNumber }}
      </p>
    </div>
    <div
      v-else
      class="border-4 border-orange-300 bg-orange-200 w-50 rounded-lg p-8"
    >
      <p
        class="text-center text-blue-300 text-opacity-50 font-semibold text-3xl truncate"
      >
        {{ tableNumber }}
      </p>
    </div>
    <div
      class="flex justify-around items-center mt-2 gap-x-2 mb-10"
      v-if="userRole === 'admin'"
    >
      <button
        v-on:click="editData(tableNumber)"
        @click="showModal = true"
        class="px-4 py-1 border border-orange-500 text-sm text-orange-500 hover:bg-orange-600 hover:text-white rounded-lg"
      >
        Edit
      </button>
      <button
        @click="showConfirmDialog = true"
        class="px-4 py-1 border border-red-500 text-sm text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
      >
        Delete
      </button>
    </div>

    <!-- delete dialog -->
    <div>
      <div v-if="showConfirmDialog" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-black opacity-50"
          @click="showConfirmDialog = false"
        ></div>
        <div
          class="top-80 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto"
        >
          <p class="text-base font-medium">
            Are you sure you want to delete table number {{ tableNumber }}?
          </p>
          <div class="flex justify-end mt-4">
            <button
              @click="showConfirmDialog = false"
              class="bg-gray-300 hover:bg-gray-600 py-1 px-10 text-gray-700 hover:text-white rounded-lg mr-4"
            >
              Cancel
            </button>
            <button
              @click="deleteItem"
              class="border border-orange-500 hover:bg-orange-500 hover:text-white py-1 px-10 text-orange-500 rounded-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- edit menu modal -->
    <div v-if="showModal" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black opacity-50"
        @click="showModal = false"
      ></div>
      <div
        class="top-60 relative pt-6 pb-8 px-6 mx-auto my-auto bg-white rounded-lg w-full h-full max-w-xl md:h-auto"
      >
        <div class="flex justify-between mb-6">
          <p class="font-bold text-xl">Edit Table</p>
          <button @click="showModal = false" class="text-2xl font-medium">
            x
          </button>
        </div>
        <!-- form start here -->
        <div>
          <label for="table_number" class="block mb-2 text-sm font-medium"
            >Table Number</label
          >
          <input
            @keyup.enter="saveData()"
            type="number"
            v-model="table_number"
            class="mb-4 border text-sm rounded-lg block w-full p-2.5"
            placeholder="ex: 104, note that each table must have an unique number"
            required
          />
        </div>
        <button
          v-on:click="saveData()"
          class="text-sm mt-4 mx-auto text-orange-500 border border-orange-500 py-2 hover:bg-orange-500 hover:text-white w-full rounded-sm hover:bg-hoverPrimaryYellow"
        >
          Edit Table
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: "http://127.0.0.1:8000/api/table/",
      showConfirmDialog: false,
      showModal: false,

      // v-model
      table_number: "",

      userRole: "",
    };
  },
  mounted() {
    this.userRole = this.$store.state.auth.user.user.role;
  },
  methods: {
    editData(tableNumber) {
      this.table_number = tableNumber;
    },
    saveData() {
      let form = {
        table_number: this.table_number,
      };
      console.log("haloo");

      let headers = authHeader();

      axios
        .put(this.baseUrl + this.tableNumber, form, { headers })
        .then((response) => {
          this.createAlert(response.data.message, "success", 1500);
          setTimeout(() => {
            this.$router.push("/table").then(() => {
              location.reload();
            });
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
          this.createAlert(error.response.data.message, "danger", 3000);
        });
    },
    deleteItem() {
      let headers = authHeader();
      axios
        .delete(this.baseUrl + this.tableNumber, { headers })
        .then((response) => {
          this.createAlert(response.data.message, "success", 1500);
          setTimeout(() => {
            this.$router.push("/table").then(() => {
              location.reload();
            });
          }, 1500);
        })
        .catch((error) => {
          this.createAlert(error.response.data.message, "danger", 1500);
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
