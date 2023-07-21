<template>
  <v-app>
    <v-container class="ma-8">
      <v-row class="mb-7">
        <v-dialog v-model="dialog" class="pa-4" width="750" height="100vh">
          <template v-slot:activator="{ props }">
            <v-btn color="primary" class="ma-auto" v-bind="props">
              Create Category
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
                <span class="text-h5">Category </span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model.trim="name"
                        label="Category name*"
                        :rules="userRules.name"
                        required
                      >
                      </v-text-field>
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
        <CategoryDataTable />
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { userValidate } from '../../helper/user/user.rules';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CategoryDataTable from '../../components/category-data-table.vue';
import Swal from 'sweetalert2';
export default {
  name: 'TheCategory',
  components: {
    CategoryDataTable,
  },
  setup() {
    const name = ref('');
    const dialog = ref(false);
    const form = ref('');
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
        };
        try {
          const result = await axios.post(
            `${process.env.VUE_APP_URL}/category/addCategory`,
            data,
            {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            },
          );
          Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Created Category',
            customClass: 'swal-wide',
            showConfirmButton: false,
            timer: 1000,
          });
          dialog.value = false;
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
          } else {
            return Swal.fire({
              icon: 'warning',
              title: 'Something goes wrong !',
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
      form,
      userRules,
      submit,
    };
  },
};
</script>

<style scoped></style>
