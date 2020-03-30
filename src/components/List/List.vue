<template lang="pug">
  div
    ul(v-if="elements.length")
      li(v-for="element in elements")
        | {{ element }}
</template>

<script>
export default {
  name: "list",

  props: {
    elements: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
