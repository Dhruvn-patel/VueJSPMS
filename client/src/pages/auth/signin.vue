<template>
  <v-app>
    <v-main>
      <v-card
        class="mx-auto mt-6 text-xs-center text-center text-h1"
        max-width="500"
        title=" Login"
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

            <v-text-field
              v-model.trim="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              class="mb-4"
              label="Password"
              counter
              @click:append="showPassword = !showPassword"
              :rules="userRules.password"
            ></v-text-field>

            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <v-btn block class="mb-8" size="large" type="submit">
              Signin
            </v-btn>
            <v-btn block class="mb-8" size="large" @click="googleSign">
              Signin with google
            </v-btn>
            <!-- <GoogleLogin :callback="callback" prompt auto-login /> -->
            <router-link
              :to="{ name: 'Register' }"
              class="v-btn v-btn--block v-btn--elevated v-theme--light v-btn--density-default v-btn--size-large v-btn--variant-elevated mb-8"
            >
              Create new Account
            </router-link>
            <router-link
              :to="{ name: 'ForgetPassword' }"
              class="v-btn v-btn--block v-btn--elevated v-theme--light v-btn--density-default v-btn--size-large v-btn--variant-elevated mb-8"
            >
              Forget Password
            </router-link>
          </v-form>
        </v-container>
      </v-card>
    </v-main>
  </v-app>
</template>
<script>
import { computed, ref } from 'vue';
import { userValidate } from '../../helper/user/user.rules';
import { loginUser } from '../../service/user.service';
import Swal from 'sweetalert2';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import {} from '../../plugins/axios.plugin';
import { googleSdkLoaded } from 'vue3-google-login';
export default {
  name: 'TheSignin',
  setup() {
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const form = ref('');
    const router = useRouter();
    const store = useStore();
    const clientId = process.env.GOOGLE_CLIENT_ID;
    /* rules computed */
    const userRules = computed(() => {
      return userValidate;
    });

    /* useActions */
    const logOutFunction = function () {
      store.dispatch('ToogleFunction');
    };

    const googleSign = async () => {
      try {
        const data = await axios.get(
          `${process.env.VUE_APP_URL}/signin/google`,
        );
        console.log('user', data);
      } catch (error) {
        console.log(error);
      }
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Signin Success',
        customClass: 'swal-wide',
        showConfirmButton: false,
        timer: 1000,
      });
    };

    async function submit() {
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          email: email.value,
          password: password.value,
        };

        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/signin/insert/`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          const responseData = result.data;
          console.log('resultSDZFDGHJHFSASDFGG', responseData);
          localStorage.setItem('token', responseData.data);
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'SuccessFully Signin ',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });

          return router.push('/');
        } catch (error) {
          console.log(error, 'error');
          if (error.response.status === 401 || error.response.status === 400) {
            return Swal.fire({
              position: 'top-center',
              icon: 'warning',
              title: error.response.data.errmsg,
              customClass: 'swal-wide',
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      }
    }

    return {
      clientId,
      submit,
      email,
      password,
      googleSign,
      form,
      userRules,
      showPassword,

      logOutFunction,
    };
  },
};
</script>

<style></style>
