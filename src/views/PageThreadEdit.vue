<template>
  <div v-if="assyncDataStatus_ready" class="col-full push-top">
    <h1>
      Editing
      <i>{{thread.title}}</i>
    </h1>
    <ThreadEditor
    @save="save"
    @cancel="cancel"
    :title="thread.title"
    :text="text"
    ref="editor"/>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
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
    },
    hasUnsavedChanges () {
      const editTitle = this.$refs.editor.form.title
      const editText = this.$refs.editor.form.text
      return (editTitle !== this.thread.title || editText !== this.text) && !this.saved
    }
  },
  data () {
    return {
      saved: false
    }
  },
  components: {
    ThreadEditor
  },
  created () {
    console.clear()
    this.fetchThread({ id: this.id }).then(thread => this.fetchPost({ id: thread.firstPostId })).then(() => {
      this.assyncDataStatus_fetched()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost.')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>
