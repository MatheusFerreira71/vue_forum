<template>
  <div class="col-full push-top">
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
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  methods: {
    save ({ title, text }) {
      this.$store.dispatch('updateThread', {
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
      return this.$store.state.posts[this.thread.firstPostId].text
    }
  },
  components: {
    ThreadEditor
  }
}
</script>
