<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <login></login>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Login from '@/components/Login.vue'

export default {
  name: 'LoginPage',
  components: {
    Login
  },
  beforeRouteEnter(to, from, next) {
    const user = sessionStorage.getItem('user');
    if(user) {
        next('/');
    } else {
        next();
    }
  }
}
</script>

