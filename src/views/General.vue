<template>
  <b-container class="vh-100">
    <b-row class="h-100 py-4">
      <b-col cols="4" class="border py-4">
        1 of 2
      </b-col>
      <b-col cols="8" class="d-inline-flex flex-column h-100 p-4">
        <div class="d-inline-flex flex-column border rounded mb-2 overflow-hidden">
          <div class="d-inline-flex justify-content-between bg-light border-bottom p-2">
            <h5 class="m-0">General</h5>
            <span>Users online: {{ users.length }}</span>
          </div>
          <b-container id="messages" class="h-100 overflow-auto">
            <b-row cols="1" class="p-4">
              <infinite-loading direction="top" spinner="spiral"
                @infinite="infiniteHandler">
                  <div slot="no-more"></div>
                  <div slot="no-results">No messages</div>
              </infinite-loading>
              <template v-for="(message, $index) in messages" >
                <b-col offset="2" cols="10" 
                  v-if="message.user_id === $store.state.user.id"
                  :key="$index"
                  class="bg-primary text-white rounded mb-2 p-2">
                  <div>
                    <b>{{ message.user.name }}</b>
                  </div>
                  <div>
                    {{ message.content }}
                  </div>
                  <div class="text-right">
                    <small>{{ new Date(message.created_at).toLocaleString() }}</small>
                  </div>
                </b-col>
                <b-col cols="8" 
                  v-else
                  :key="$index"
                  class="bg-light rounded mb-2 p-2">
                  <div>
                    <b>{{ message.user.name }}</b>
                  </div>
                  <div>
                    {{ message.content }}
                  </div>
                  <div class="text-right">
                    <small>{{ new Date(message.created_at).toLocaleString() }}</small>
                  </div>
                </b-col>
              </template>
            </b-row>
            <b-row class="px-2 pb-4">
              <b-col>
                {{ typing ? typing+' is typing...' : '&zwnj;' }}
              </b-col>
            </b-row>
          </b-container>
        </div>
        <b-form inline @submit.prevent="sendMessage">
          <b-form-input v-model="content" @input="whisperTyping" class="flex-grow-1 mr-2" autocomplete="off" placeholder="Message"></b-form-input>
          <b-button type="submit" variant="primary">Send</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      messages: [],
      content: '',
      users: [],
      typing: '',
    }
  },
  methods: {
    sendMessage() {
      axios.post('/api/messages', { content: this.content })
        .then(response => { 
          console.log(response)
          this.messages.push(response.data)
          this.content = ''
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    whisperTyping() {
      window.Echo.join('general')
        .whisper('typing', {
            name: this.$store.state.user.name
        })
    },
    infiniteHandler($state) {
      axios.get('/api/messages', {
        params: {
          page: this.page,
        },
      }).then(response => {
        if (response.data.data.length) {
          this.page += 1
          this.messages.unshift(...response.data.data.reverse())
          $state.loaded()
        } else {
          $state.complete()
        }
      });
    },
  },
  created() {
    axios.get('/api/messages', {
        params: {
          page: this.page,
        },
      })
      .then(response => { 
        console.log(response)
        this.messages = response.data.data.reverse()

        window.Echo.join('general')
          .here((users) => {
            this.users = users
          })
          .joining((user) => {
            this.users.push(user)
          })
          .leaving((user) => {
            this.users = this.users.filter(el => el.id !== user.id);
          })
          .listen('MessageSent', (e) => {
            this.messages.push(e.message)
          })
          .listenForWhisper('typing', (e) => {
              this.typing = e.name
              setTimeout(() => {this.typing = ''}, 1500);
          })
      })
      .catch(error => {
        console.log(error.response)
      })
  }
}
</script>

<style scoped>
  #messages::-webkit-scrollbar {
      display: none;
  }
</style>