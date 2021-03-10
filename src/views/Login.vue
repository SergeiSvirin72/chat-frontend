<template>
  <b-form @submit.prevent="handleLogin" novalidate>
    <b-form-group>
      <b-form-input v-model="fields.email" 
        placeholder="E-mail" 
        :state="errors.email ? false : null"></b-form-input>
      <div class="invalid-feedback" 
        v-if="errors.email">{{ errors.email[0] }}</div>
    </b-form-group>
    <b-form-group>
      <b-form-input v-model="fields.password"
        type="password"
        placeholder="Password"
        :state="errors.password ? false : null"></b-form-input>
      <div class="invalid-feedback" 
        v-if="errors.password">{{ errors.password[0] }}</div>
    </b-form-group>
    <b-button type="submit" block variant="primary">Log In</b-button>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
        fields: {},
        errors: {},
    }
  },
  methods: {
    handleLogin() {
      axios.get('/sanctum/csrf-cookie')
        .then(() => axios.post('/login', this.fields))
        .then(() => axios.get('/api/user'))
        .then(response => { 
          localStorage.setItem('guest', false)
          this.$store.commit('setUser', response.data)
          this.$router.push('/')
        })
        .catch((error) => {
          console.log(error.response)
          if (error.response.status === 422) {
            this.errors = error.response.data.errors || {}
          }
        })
    }
  }
}
</script>