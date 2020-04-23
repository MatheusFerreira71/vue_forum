export default {
  data () {
    return {
      assyncDataStatus_ready: false
    }
  },
  methods: {
    assyncDataStatus_fetched () {
      this.assyncDataStatus_ready = true
      this.$emit('ready')
    }
  }
}
