<template lang="pug">
  button.c-button(ref="c-button", :class="customClass", @click="handleClick")
    | {{ label }}
</template>

<script>
export default {
  name: "CButton",

  props: {
    size: {
      type: String,
      default: '',
      validator: (value) => ['', 'small', 'medium', 'big'].includes(value)
    },
    label: {
      type: String
    }
  },

  data() {
    return {
      counter: 0
    }
  },

  computed: {
    customClass () {
      return this.size ? `c-button--${this.size}` : ''
    }
  },

  methods: {
    handleClick () {
      this.counter++
      this.$emit('click', 'button clicked!')
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
