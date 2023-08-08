<template>
  <v-app>
    <v-main>
      <v-card
        v-if="!flag"
        class="mx-auto mt-6 text-xs-center text-center text-h1"
        max-width="500"
        title=" Forget Password "
      >
        <v-container class="pa-10">
          <v-form
            class="pt-6"
            v-model="valid"
            @submit.prevent="submitotp"
            ref="form"
          >
            <v-text-field
              v-model.trim="otp"
              type="number"
              label="OTP*"
            ></v-text-field>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-btn block class="mb-8" size="large" type="submit">
              Submit
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
      <v-card
        v-else
        class="mx-auto mt-6 text-xs-center text-center text-h1"
        max-width="500"
        title=" Forget Password "
      >
        <v-container class="pa-10">
          <v-form
            class="pt-6"
            v-model="valid"
            @submit.prevent="submit"
            ref="form"
          >
            <v-text-field
              v-model.trim="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              class="mb-4"
              label="New Password"
              :rules="userRules.password"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-text-field
              v-model.trim="validpassword"
              :append-icon="validshowPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="validshowPassword ? 'text' : 'password'"
              class="mb-4"
              label="Confirm Password"
              :rules="userRules.password"
              counter
              @click:append="validshowPassword = !validshowPassword"
            ></v-text-field>
            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <v-btn block class="mb-8" size="large" type="submit">
              Submit
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { userValidate } from '../../helper/user/user.rules';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  name: 'TheOTP',
  setup() {
    const password = ref('');
    const showPassword = ref(false);
    const validpassword = ref('');
    const validshowPassword = ref(false);
    const otp = ref('');
    const form = ref('');
    const flag = ref(false);
    const router = useRouter();
    /* rules computed */
    const userRules = computed(() => {
      return userValidate;
    });
    //
    /* methods */
    async function submitotp() {
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          OTP: otp.value,
        };

        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/forgetemail/otp
          `,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          const responseData = result.data;
          console.log('otp', responseData);
          //   return router.push('/forgetpassword/otp');
          flag.value = !flag.value;
        } catch (error) {
          console.log(error, 'error');
          if (error.response.status === 400) {
            return Swal.fire({
              position: 'top-center',
              icon: 'warning',
              title: error.response.data.message,
              customClass: 'swal-wide',
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      }
    }

    async function submit() {
      const validate = await form.value.validate();

      if (validate.valid) {
        const data = {
          password: password.value,
        };

        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/forgetemail/changePassword
          `,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          const responseData = result.data;
          console.log('otp', responseData);
          return router.push('/login');
        } catch (error) {
          console.log(error, 'error');
          if (error.response.status === 400) {
            return Swal.fire({
              position: 'top-center',
              icon: 'warning',
              title: error.response.data.message,
              customClass: 'swal-wide',
              showConfirmButton: false,
              timer: 1000,
            });
          }
          return Swal.fire({
            position: 'top-center',
            icon: 'warning',
            title: 'some things wrong !',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    }
    return {
      flag,
      otp,
      password,
      showPassword,
      form,
      userRules,
      validpassword,
      validshowPassword,
      submitotp,
      submit,
    };
  },
};
</script>

<style></style>

<!-- 

const prod = [{
  "id": 35,
  "orderId": 15,
  "userId": 5,
  "productId": 1,
  "quantity": 2,
  "Product": {
    "id": 1,
    "ProductName": "Lenovo Nj12333lsfs i5",
    "description": "Lenovo Nj12333lsfs i5 processor 1Tb  + 32 Gb",
    "price": 150000,
    "quantity": 21,
    "createdAt": "2023-07-20T04:30:29.337Z",
    "updatedAt": "2023-07-20T04:30:29.337Z",
    "deletedAt": null
  }
}, {
  "id": 36,
  "orderId": 15,
  "userId": 5,
  "productId": 3,
  "quantity": 1,
  "Product": {
    "id": 3,
    "ProductName": "iphone 14 Pro Max",
    "description": "iphone 14 Pro Max 256 + 3 camera",
    "price": 55000,
    "quantity": 8,
    "createdAt": "2023-07-20T04:32:05.816Z",
    "updatedAt": "2023-07-20T04:32:05.816Z",
    "deletedAt": null
  }
}, {
  "id": 37,
  "orderId": 15,
  "userId": 5,
  "productId": 1,
  "quantity": 1,
  "Product": {
    "id": 1,
    "ProductName": "Lenovo Nj12333lsfs i5",
    "description": "Lenovo Nj12333lsfs i5 processor 1Tb  + 32 Gb",

    "price": 150000,
    "quantity": 21,
    "createdAt": "2023-07-20T04:30:29.337Z",
    "updatedAt": "2023-07-20T04:30:29.337Z",
    "deletedAt": null
  }
}, {
  "id": 38,
  "orderId": 15,
  "userId": 5,
  "productId": 3,
  "quantity": 1,
  "Product": {
    "id": 3,
    "ProductName": "iphone 14 Pro Max",
    "description": "iphone 14 Pro Max 256 + 3 camera",

    "price": 55000,
    "quantity": 8,
    "createdAt": "2023-07-20T04:32:05.816Z",
    "updatedAt": "2023-07-20T04:32:05.816Z",
    "deletedAt": null
  }
}]

const order=[{
    "id": 14,
    "userId": 5,
    "isOrdered": false,
    "totalPrice": 3585000,
    "createdAt": "2023-07-21T06:30:06.183Z",
    "updatedAt": "2023-07-21T06:30:06.183Z",
    "deletedAt": null,
    "deleted": false,
    "productId": null,
    "OrderProduct": [{
      "id": 32,
      "orderId": 14,
      "userId": 5,
      "productId": 2,
      "quantity": 1
    }, {
      "id": 33,
      "orderId": 14,
      "userId": 5,
      "productId": 1,
      "quantity": 2
    }]
  }, {
    "id": 15,
    "userId": 5,
    "isOrdered": false,
    "totalPrice": 4340000,
    "createdAt": "2023-07-25T11:59:19.539Z",
    "updatedAt": "2023-07-25T11:59:19.539Z",
    "deletedAt": null,
    "deleted": false,
    "productId": null,
    "OrderProduct": [{
      "id": 34,
      "orderId": 15,
      "userId": 5,
      "productId": 2,
      "quantity": 1
    }, {
      "id": 35,
      "orderId": 15,
      "userId": 5,
      "productId": 1,
      "quantity": 2
    }, {
      "id": 36,
      "orderId": 15,
      "userId": 5,
      "productId": 3,
      "quantity": 1
    }, {
      "id": 37,
      "orderId": 15,
      "userId": 5,
      "productId": 1,
      "quantity": 1
    }, {
      "id": 38,
      "orderId": 15,
      "userId": 5,
      "productId": 3,
      "quantity": 1
    }]
  }]

const ans=[]
for(let i=0;i<order.length;i++){

for(let j=0;j<prod.length;j++)
{
if(order[i].id==prod[j].orderId)
{
ans.push_back({...order[i],...prod[j]});
}
}
}


for(let val of ans)
console.log(val)



 -->
