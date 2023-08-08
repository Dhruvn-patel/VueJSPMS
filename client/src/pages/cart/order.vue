<template>
  <v-app>
    <Header />
    <v-main class="my-5">
      <v-container class="d-flex justify-space-evenly">
        <v-card class="d-flex flex-column" width="60vh">
          <v-card-title> Billing Info</v-card-title>
          <v-card-body class="d-flex pa-54 flex-column ma-5">
            <v-label class="my-4">Address</v-label>
            <v-info> 12, RamNagar,382418 </v-info>

            <v-label class="my-4">PhoneNumber</v-label>
            <v-info>558258516</v-info>

            <v-label class="my-4">Email</v-label>
            <v-info>asad@gmail.com</v-info>
          </v-card-body>
        </v-card>

        <v-card class="d-flex flex-column px-10">
          <v-card-title>Order Total:</v-card-title>
          <v-card-body>
            <v-row>
              <v-col class="mx-5 my-3">Products</v-col>
              <v-col class="mx-5 my-3">qty</v-col>
              <v-col class="mx-5 my-3">Total</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-for="singleorder in order" :key="singleorder">
              <v-col class="mx-5 my-3">{{ singleorder.ProductName }}</v-col>
              <v-col class="mx-5 my-3">{{ singleorder.quantity }}</v-col>
              <v-col class="mx-5 my-3">{{
                (singleorder.price * singleorder.quantity).toLocaleString(
                  'en-IN',
                  {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  },
                )
              }}</v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col class="mx-5 my-3"> TotalPrice : </v-col>
              <v-spacer></v-spacer>
              <v-col class="mx-5 my-3">
                {{
                  totalPrice.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    style: 'currency',
                    currency: 'INR',
                  })
                }}
              </v-col>
            </v-row>

            <div class="text-center my-6">
              <v-btn color="primary" @click="checkoutFun">
                Checkout Payment
              </v-btn>
            </div>
          </v-card-body>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../../components/header.vue';
export default {
  name: 'TheOrder',
  components: {
    Header,
  },
  setup() {
    const router = useRouter();
    let order = ref([]);
    let totalPrice = ref(0);
    let userId = JSON.parse(localStorage.getItem('loginUser')).userId;
    order = JSON.parse(localStorage.getItem('order'));
    totalPrice = Number(JSON.parse(localStorage.getItem('orderTotalPrice')));
    const data = { userId };
    const checkoutFun = async () => {
      try {
        await axios.post(`${process.env.VUE_APP_URL}/cart/OrderAdd`, data, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        /* remove order details*/
        localStorage.removeItem('order');
        localStorage.removeItem('orderTotalPrice');

        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Order Added  !',
          customClass: 'swal-wide',
          showConfirmButton: false,
          timer: 1000,
        });
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    return {
      order,
      totalPrice,
      checkoutFun,
    };
  },
};
</script>

<style></style>
