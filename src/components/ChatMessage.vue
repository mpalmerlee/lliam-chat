<script setup lang="ts">
import type { Message } from "ollama";
import { computed } from "vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";

interface Props {
  message: Message;
}

const props = defineProps<Props>();

const messageClass = computed(() => {
  return props.message.role === "user"
    ? "message userMessage"
    : "message agentMessage";
});
</script>

<template>
  <div :class="messageClass">
    <MarkdownRenderer :source="props.message.content"></MarkdownRenderer>
  </div>
</template>

<style scoped>
.message {
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.userMessage {
  background-color: var(--primary-50);
}

.agentMessage {
  background-color: var(--blue-50);
}
</style>
