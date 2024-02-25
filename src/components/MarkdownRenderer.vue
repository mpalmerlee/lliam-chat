<script setup lang="ts">
import MarkdownIt from "markdown-it";

interface Props {
  source: string;
}

const props = defineProps<Props>();

const markdown = new MarkdownIt();
</script>

<template>
  <div class="markdown-body" v-html="markdown.render(props.source)" />
</template>

<style scoped>
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 15px;
  background-color: inherit;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
