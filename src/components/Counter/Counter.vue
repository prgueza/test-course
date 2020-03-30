<template lang="pug">
  div
    p(ref="count") {{ count }}
    button(@click="handleClick", ref="button") Incrementar valor
</template>

<script>
export default {
  name: "counter",

  props: {
    initialValue: {
      type: Number,
      default: 0,
      validator: value => value >= 0
    },
  },

  data() {
    return {
      count: 0
    }
  },

  mounted () {
    this.count = this.initialValue
  },

  methods: {
    handleClick () {
      this.count++
      this.$emit('count', this.count)
    }
  }
}
</script>
