<template>
  <div>
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea name id cols="30" rows="10" class="form-input" v-model="text"></textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    save () {
      const postId = `greatPost${Math.random()}`
      const post = {
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        threadId: this.threadId,
        userId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
        '.key': postId
      }
      this.text = ''
      this.$emit('save', { post })
    }
  },
  data () {
    return {
      text: ''
    }
  },
  props: {
    threadId: {
      required: true,
      type: String
    }
  }
}
</script>
