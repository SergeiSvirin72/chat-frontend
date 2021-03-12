<template>
  <div class="d-inline-flex flex-column h-100">
    <b-form-input type="search" v-model="search"
    placeholder="Search by username" class="mb-2"></b-form-input>
    <div class="d-inline-flex flex-column overflow-auto border rounded">
      <div v-if="search">
        <div class="p-2 bg-light border-bottom">
          <h5 class="m-0">Search</h5>
        </div>
        <b-list-group class="overflow-auto">
          <b-list-group-item v-for="(room, index) in filteredRooms" 
            :key="index" :to="'/messages/' + room.id"
            class="d-flex align-items-center justify-content-between border-top-0 border-left-0 border-right-0 p-2">
              <TextAvatar :username="room.users[0].username" class="mr-2"></TextAvatar>
              <span class="mr-auto">{{ room.users[0].username }}</span>
          </b-list-group-item>
          <b-list-group-item v-for="user in searchedUsers" :key="user.username" href="#"
            class="d-flex align-items-center justify-content-between border-top-0 border-left-0 border-right-0 p-2">
              <TextAvatar :username="user.username" class="mr-2"></TextAvatar>
              <span class="mr-auto">{{ user.username }}</span>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div v-else>
        <div class="p-2 bg-light border-bottom">
          <h5 class="m-0">Rooms</h5>
        </div>
        <b-list-group class="overflow-auto">
          <b-list-group-item v-for="(room, index) in rooms" 
          :key="index" :to="'/messages/' + room.id"
            class="d-flex align-items-center justify-content-between border-top-0 border-left-0 border-right-0 p-2">
            <div class="d-flex align-items-center">
              <TextAvatar :username="room.users[0].username" class="mr-2"></TextAvatar>
              <span class="mr-auto">{{ room.users[0].username }}</span>
            </div>
            <div class="px-2">
              <b-badge>5</b-badge>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
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
