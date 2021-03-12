<template>
  <div>
    <b-list-group-item v-for="(room, index) in filteredRooms" :key="index" href="#"
      class="d-flex align-items-center justify-content-between border-top-0 border-left-0 border-right-0 p-2">
        <TextAvatar :username="room.users[0].username" class="mr-2"></TextAvatar>
        <span class="mr-auto">{{ room.users[0].username }}</span>
    </b-list-group-item>
  </div>
</template>

<script>
import TextAvatar from './TextAvatar';

export default {
  components: { TextAvatar },
  data() {
    return {
      searchedUsers: [],
      rooms: [],
      search: '',
    }
  },
  methods: {
    getRooms() {
      axios.get('/api/rooms')
        .then(response => {
          this.rooms = response.data
        })
    },
    getSearchedRooms(search) {
      axios.get('/api/users?q=' + search)
        .then(response => {
          this.searchedUsers = response.data
        })
    },
  },
  computed: {
    filteredRooms() {
      return this.rooms
        .filter((item) => item.users[0].username
          .toLowerCase()
          .startsWith(this.search, 0))
    }
  },
  watch: {
    search(search) {
      if (search) {
        this.searchedRooms = this.getSearchedRooms(search);
      }
    },
  },
  created() {
    this.getRooms()
  }
}
</script>
