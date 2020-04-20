<template>
  <div v-if="assyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{thread.title}}
      <router-link
        :to="{name: 'ThreadEdit', id: this.id}"
        class="btn-green btn-small"
        tag="button"
      >Edit this Thread</router-link>
    </h1>
    <p>
      Por <a href="#" class="link-unstyled">{{threadCreator.name}}</a>, <AppDate :timestamp="thread.publishedAt"/>
      <span
      style="float:right; margin-top: 2px;"
      class="hide-mobile text-faded text-small"
      >{{repliesCount === 1 ? `${repliesCount} reply` : `${repliesCount} replies`}} by
      {{contribuitorsCount === 1 ? `${contribuitorsCount} contribuitor` : `${contribuitorsCount} contribuitors`}}</span>
    </p>
    <PostList :posts="posts"/>
    <PostEditor
    :threadId="id"
    />
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { countObjectProperties } from '@/utils'
import { mapActions } from 'vuex'
import assyncDataStatus from '@/mixins/assyncDataStatus'
export default {
  mixins: [assyncDataStatus],
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    PostList,
    PostEditor
  },
  computed: {
    posts () {
      return Object.values(this.$store.state.posts)
        .filter(post => Object.values(this.thread.posts).includes(post['.key']))
    },
    thread () {
      return this.$store.state.threads[this.id]
    },
    threadCreator () {
      return this.$store.state.users[this.thread.userId]
    },
    repliesCount () {
      return this.$store.getters.threadRepliesCount(this.thread['.key'])
    },
    contribuitorsCount () {
      return countObjectProperties(this.thread.contributors)
    }
  },
  methods: {
    ...mapActions(['fetchThread', 'fetchUser', 'fetchPosts'])
  },
  created () {
    console.clear()
    this.fetchThread({ id: this.id }).then(thread => {
      this.fetchUser({ id: thread.userId })
      return this.fetchPosts({ ids: Object.keys(thread.posts) })
    }).then(posts => {
      return Promise.all(posts.map(post => { this.fetchUser({ id: post.userId }) }))
    }).then(() => { this.assyncDataStatus_fetched() })
  }
}
</script>
