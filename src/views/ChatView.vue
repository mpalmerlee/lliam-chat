<script setup lang="ts">
import ModelSelector from "@/components/ModelSelector.vue";
import Chat from "@/components/Chat.vue";
</script>

<template>
  <main>
    <div class="flex-grid">
      <div class="main-col">
        <Chat />
      </div>
      <div class="right-col">
        <ModelSelector />
      </div>
    </div>
  </main>
</template>

<style scoped>
.flex-grid {
  display: flex;
  height: 100%;
}

.main-col {
  width: 75%;
}

.right-col {
  width: 25%;
}
</style>
