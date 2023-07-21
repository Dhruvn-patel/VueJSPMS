<template>
  <v-app class="ma-7">
    <v-row class="mb-7">
      <v-dialog v-model="dialog" class="pa-4" width="750" height="100vh">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" class="pa-5 ma-auto" v-bind="props">
            Create User
          </v-btn>
        </template>
        <v-card>
          <v-form
            class="pt-6"
            @submit.prevent="submit"
            v-model="valid"
            ref="form"
          >
            <v-card-title class="text-center">
              <span class="text-h5">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="name"
                      label="Name*"
                      :rules="userRules.name"
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="email"
                      label="Email*"
                      :customRules="userRules.email"
                      required
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      class="mb-4"
                      label="Password"
                      :rules="userRules.password"
                      counter
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      :items="['Admin', 'User']"
                      label="Select Role*"
                      :rules="userRules.select"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" type="submit">
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <DataTable />
    </v-row>
  </v-app>
</template>

<script>
import { userValidate } from '../../helper/user/user.rules';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

import DataTable from '../../components/data-table.vue';

export default {
  name: 'TheUsers',
  components: {
    DataTable,
  },
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const dialog = ref(false);
    const form = ref('');
    const router = useRouter();
    const valid = ref(false);

    /* rules computed */
    const userRules = computed(() => {
      return userValidate;
    });

    async function submit() {
      const validate = await form.value.validate();
      if (validate.valid) {
        const data = {
          name: name.value,
          email: email.value,
          password: password.value,
          rolesId: '2',
        };
        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/users/addUser`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Created User',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
          dialog.value = false;
          return router.push('/dashboard');
        } catch (error) {
          if (error.response.status === 409) {
            valid.value = true;
            return Swal.fire({
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
      dialog,
      name,
      email,
      password,
      showPassword,
      form,
      userRules,
      submit,
    };
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
</style>
