<template>
  <div>
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea name id cols="30" rows="10" class="form-input" v-model="text"></textarea>
      </div>
      <div class="form-actions">
        <button @click.prevent="cancel" class="btn btn-ghost" v-if="isUpdate">Cancel</button>
        <button class="btn-blue">{{isUpdate ? 'Update Post' : 'Submit Post'}}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    isUpdate () {
      return !!this.post
    }
  },
  methods: {
    save () {
      this.persist().then(post => {
        this.$emit('save', { post })
      })
    },
    create () {
      const post = {
        text: this.text,
        threadId: this.threadId
      }
      this.text = ''
      this.$emit('save', { post })
      return this.$store.dispatch('createPost', post)
    },
    update () {
      const payload = {
        id: this.post['.key'],
        text: this.text
      }
      return this.$store.dispatch('updatePost', payload)
    },
    persist () {
      return this.isUpdate ? this.update() : this.create()
    },
    cancel () {
      this.$emit('cancel')
    }
  },
  data () {
    return {
      text: this.post ? this.post.text : ''
    }
  },
  props: {
    threadId: {
      type: String
    },
    post: {
      type: Object,
      validator: obj => {
        const keyIsValid = typeof obj['.key'] === 'string'
        const textIsValid = typeof obj.text === 'string'
        const valid = keyIsValid && textIsValid
        if (!textIsValid) {
          console.log('The post prop object must include a `text` atribute!')
        }
        if (!keyIsValid) {
          console.log('The post prop object must include a `key` atribute!')
        }
        return valid
      }
    }
  }
}
</script>
