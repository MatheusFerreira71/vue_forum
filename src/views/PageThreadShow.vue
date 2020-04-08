<template>
  <div v-if="thread && threadCreator" class="col-large push-top">
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
import firebase from 'firebase'
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { countObjectProperties } from '@/utils'
export default {
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
  created () {
    // fetch thread
    firebase.database().ref('threads').child(this.id).once('value', snapshot => {
      const thread = snapshot.val()
      this.$store.commit('setThread', { thread: { ...thread, '.key': snapshot.key }, threadId: snapshot.key })
      // fetch user
      firebase.database().ref('users').child(thread.userId).once('value', snapshot => {
        const user = snapshot.val()
        this.$store.commit('setUser', { user: { ...user, '.key': snapshot.key }, userId: snapshot.key })
      })
      Object.keys(thread.posts).forEach(postId => {
        // fetch Post
        firebase.database().ref('posts').child(postId).once('value', snapshot => {
          const post = snapshot.val()
          this.$store.commit('setPost', { post: { ...post, '.key': snapshot.key }, postId: snapshot.key })
          // fetch user
          firebase.database().ref('users').child(post.userId).once('value', snapshot => {
            const user = snapshot.val()
            this.$store.commit('setUser', { user: { ...user, '.key': snapshot.key }, userId: snapshot.key })
          })
        })
      })
    })
  }
}
</script>
