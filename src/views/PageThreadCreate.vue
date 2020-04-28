<template>
  <div class="col-full push-top" v-if="assyncDataStatus_ready">
    <h1>
      Create new thread in
      <i>{{forum.name}}</i>
    </h1>
    <ThreadEditor ref="editor" @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { mapActions } from 'vuex'
import assyncDataStatus from '@/mixins/assyncDataStatus'
export default {
  mixins: [assyncDataStatus],
  props: {
    forumId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      saved: false
    }
  },
  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    save ({ title, text }) {
      this.createThread({
        text,
        title,
        forumId: this.forum['.key']
      }).then(thread => {
        this.saved = true
        this.$router.push({ name: 'ThreadShow', params: { id: thread['.key'] } })
      })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forum['.key'] } })
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums[this.forumId]
    },
    hasUnsavedChanges () {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  components: {
    ThreadEditor
  },
  created () {
    console.clear()
    this.fetchForum({ id: this.forumId }).then(() => {
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
