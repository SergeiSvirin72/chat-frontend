<template>
  <b-container class="vh-100">
    <b-row class="h-100 py-4">
      <b-col cols="4" class="h-100 py-4">
        <RoomsAside class="w-100"></RoomsAside>
      </b-col>
      <b-col cols="8" class="d-inline-flex flex-column h-100 py-4">
        {{ $router.currentRoute.path }}
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RoomsAside from '../components/RoomsAside'

export default {
  components: { RoomsAside },
  data() {
    return {
    }
  },
  methods: {

  },
  created() {

  }
}
</script>
