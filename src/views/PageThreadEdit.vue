<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <ThreadEditor
    @save="save"
    @cancel="cancel"
    :title="thread.title"
    :text="text"/>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { mapActions } from 'vuex'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    save ({ title, text }) {
      this.updateThread({
        text,
        title,
        id: this.id
      }).then(thread => this.$router.push({ name: 'ThreadShow', params: { id: this.id } }))
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.id } })
    }
  },
  computed: {
    thread () {
      return this.$store.state.threads[this.id]
    },
    text () {
      const post = this.$store.state.posts[this.thread.firstPostId]
      return post ? post.text : null
    }
  },
  components: {
    ThreadEditor
  },
  created () {
    console.clear()
    this.fetchThread({ id: this.id })
      .then(thread => this.fetchPost({ id: thread.firstPostId }))
  }
}
</script>
