<template>
  <div v-if="assyncDataStatus_ready" class="forum-wrapper">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details">
          <h1>{{forum.name}}</h1>
          <p>{{forum.description}}</p>
        </div>
        <router-link
          :to="{name: 'ThreadCreate', params: {forumId: this.forum['.key']}}"
          class="btn-green btn-small"
        >Start a thread</router-link>
      </div>
    </div>
    <div class="col-full push-top">
      <ThreadList :threads="threads" />
    </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { mapActions } from 'vuex'
import assyncDataStatus from '@/mixins/assyncDataStatus'
export default {
  mixins: [assyncDataStatus],
  components: {
    ThreadList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUser'])
  },
  computed: {
    forum () {
      return this.$store.state.forums[this.id]
    },
    threads () {
      return Object.values(this.$store.state.threads).filter(
        thread => thread.forumId === this.id
      )
    }
  },
  created () {
    console.clear()
    this.fetchForum({ id: this.id }).then(forum => {
      this.fetchThreads({ ids: forum.threads })
        .then(threads => Promise.all(threads.map(thread => this.fetchUser({ id: thread.userId }))))
        .then(() => { this.assyncDataStatus_fetched() })
    })
  }
}
</script>

<style scoped>
.forum-wrapper {
  width: 100%;
}
</style>
