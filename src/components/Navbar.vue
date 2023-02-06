<template>
  <header class="bg-white text-gray-800 py-6 fixed top-0 w-10/12 left-0 z-10" style="left: 253px;">
    <div class="flex justify-between px-8 items-center">
        <div>
            <p>{{ currentDate }}</p>
        </div>
        <div>
            <div class="flex justify-around items-start gap-x-5">
                <img src="../assets/user.jpg" alt="User Default Picture" class="w-10 rounded-lg">
                <div>
                    <p class="text-sm text-gray-500">Hi, Winter</p>
                    <p class="text-sm text-gray-500">Cashier</p>
                </div>
            </div>
        </div>
    </div>
  </header>
</template>

<script>
    export default{
        data(){
            return{
                currentDate: "",
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            }
        },
        methods:{
           // date
            getCurrentDate(){
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            let dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            this.currentDate = dayName[date.getDay()] + ", " + (day < 10 ? '0' : '') + day + " - " + this.months[month] + " - " + year;
            }
        },
        mounted(){
            this.getCurrentDate()
        }
    }
</script>