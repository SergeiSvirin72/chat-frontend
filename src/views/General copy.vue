<template>
  <b-container class="vh-100">
    <b-row class="h-100 py-4">
      <b-col cols="4" class="border py-4">
        1 of 2
      </b-col>
      <b-col cols="8" class="d-flex flex-column border py-4 h-100">
        <b-container id="messages" class="flex-grow-1 overflow-auto border rounded mb-2 h-100">
          <b-row cols="1" class="flex-grow-1 p-4">
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
        </b-container>
        <b-form inline @submit.prevent="sendMessage">
          <b-form-input v-model="content" class="flex-grow-1 mr-2" placeholder="Message"></b-form-input>
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
      distance: 500,
      page: 1,
      messages: [],
      content: ''
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
    infiniteHandler($state) {
      axios.get('/api/messages', {
        params: {
          page: this.page,
        },
      }).then(response => {
        if (response.data.data.length) {
          this.page += 1;
          this.messages.unshift(...response.data.data.reverse());
          // this.messages.push(...response.data.data);
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },
  },
  created() {
    // axios.get('/api/messages', {
    //     params: {
    //       page: this.page,
    //     },
    //   })
    //   .then(response => { 
    //     console.log(response)
    //     this.messages = response.data.data
    //   })
    //   .catch(error => {
    //     console.log(error.response)
    //   })

    window.Echo.channel(`channel-general`)
      .listen('MessageSent', (e) => {
        console.log(e)
        this.messages.push(e.message)
      })
  }
}
</script>

<style scoped>
  #messages::-webkit-scrollbar {
      display: none;
  }
</style>