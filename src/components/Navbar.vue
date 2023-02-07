<template>
  <header
    class="bg-white text-gray-800 py-6 fixed top-0 w-10/12 left-0 z-10"
    style="left: 253px"
  >
    <div class="flex justify-between px-8 items-center">
      <div>
        <p>{{ currentDate }}</p>
      </div>
      <div
        class="relative hover:cursor-pointer"
        @mouseenter="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <div class="flex justify-around items-start gap-x-5">
          <img
            src="../assets/user.jpg"
            alt="User Default Picture"
            class="w-10 rounded-lg"
          />
          <div>
            <p class="text-sm text-gray-500">
              Hello, {{ userData.user.user_name }}!
            </p>
            <p class="text-sm text-gray-500">{{ userData.user.role }}</p>
          </div>
        </div>
        <div
          class="absolute right-0 mt-0 bg-white rounded-lg shadow-lg"
          v-if="showDropdown"
        >
          <a
            class="block px-14 py-2 rounded-lg text-sm text-blue-300 hover:bg-orange-200"
            >Profile</a
          >
          <a
            @click="handleLogout"
            class="block px-14 py-2 rounded-lg text-sm text-blue-300 hover:bg-orange-200"
            >Logout</a
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      showDropdown: false,
      userData: [],
      currentDate: "",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  methods: {
    // date
    getCurrentDate() {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      let dayName = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      this.currentDate =
        dayName[date.getDay()] +
        ", " +
        (day < 10 ? "0" : "") +
        day +
        " - " +
        this.months[month] +
        " - " +
        year;
    },
    handleLogout() {
      this.$store.dispatch("auth/logout").then(
        () => {
          this.$router.push("/login");
        },
        (error) => {
          this.loading = false;
          createToast(error.message, {
            position: "top-right",
            type: "error",
            timeout: 3000,
            dismissible: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            closeOnClick: true,
            closeButton: true,
            icon: true,
            rtl: false,
          });
        }
      );
    },
  },
  computed: {
    userData() {
      this.userData = JSON.parse(localStorage.getItem("user"));
      return this.userData;
    },
  },
  mounted() {
    this.getCurrentDate();
    // this.userData = JSON.parse(localStorage.getItem("user"));
  },
};
</script>
