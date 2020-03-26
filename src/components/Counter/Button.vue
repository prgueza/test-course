<template lang="pug">
  p {{ count }}
  button(@click="handleClick") Incrementar valor
</template>

<script>
export default {
  name: "CButton",

  props: {
    initialValue: {
      type: Number,
      default: 0
    },
  },

  data() {
    return {
      counter: 0
    }
  },

  methods: {
    handleClick () {
      this.counter++
      this.$emit('count', this.count)
    }
  }
}
</script>

<style lang="scss" scoped>
  .c-button {
    &--medium {
      font-size: 1rem;
    }
    &--big {
      font-size: 2rem;
    }
    &--small {
      font-size: .5rem;
    }
  }
</style>
