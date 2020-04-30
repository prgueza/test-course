<template lang="pug">
  button.c-button(ref="c-button", :class="customClass", @click="handleClick")
    | {{ label }} {{ count }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import store from './store'
export default {

  name: "CButton",

  store,

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

  computed: {
    ...mapGetters(['count']),
    customClass () {
      return this.size ? `c-button--${this.size}` : ''
    }
  },

  methods: {
    ...mapActions(['increment']),
    handleClick () {
      this.increment()
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
