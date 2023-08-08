<template>
  <v-app>
    <v-main>
      <v-card
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
              v-model.trim="email"
              class="me-10"
              label="E-mail"
              :rules="userRules.email"
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
import { useStore } from 'vuex';
import { userValidate } from '../../helper/user/user.rules';
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
  name: 'foregetPassword',
  setup() {
    const email = ref('');
    const form = ref('');
    const router = useRouter();
    const store = useStore();

    /* rules computed */
    const userRules = computed(() => {
      return userValidate;
    });

    /* methods */
    async function submit() {
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          email: email.value,
        };

        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/forgetemail/forgot-password
`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              //   withCredentials: true,
            },
          );
          const responseData = result.data;
          console.log('ssdad', responseData);
          return router.push('/forgetpassword/otp');
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
    return {
      email,
      form,
      userRules,
      submit,
    };
  },
};
</script>

<style></style>
