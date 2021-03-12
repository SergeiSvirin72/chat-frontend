<template>
  <b-avatar :text="text"></b-avatar>
</template>

<script>
export default {
  props: ['username'],
  data() {
    return {
      variants: [
        'secondary', 
        'primary', 
        'dark', 
        'light', 
        'success', 
        'danger', 
        'warning', 
        'info'
      ]
    }
  },
  computed: {
    text() {
      return this.username
        .split(' ')
        .reduce((previousValue, item) => previousValue + item.charAt(0), '')
    },
    variant() {
      return this.variants[Math.floor(Math.random()*this.variants.length)]
    }
  }
}
</script>