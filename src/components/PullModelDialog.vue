<script setup lang="ts">
import { ref, toRefs } from "vue";
interface Props {
  visible: boolean;
}
const props = defineProps<Props>();
const { visible } = toRefs(props);
const name = ref("");
const emit = defineEmits<{
  (e: "create", name: string): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div class="pull-model-dialog">
    <Dialog
      v-model:visible="visible"
      modal
      header="Load a new model"
      :style="{ width: '25rem' }"
    >
      <span class="p-text-secondary block mb-5">Enter the model name</span>
      <div class="flex align-items-center gap-3 mb-5">
        <label for="breakout-name" class="font-semibold w-6rem"
          >Model name</label
        >
        <InputText
          id="breakout-name"
          class="flex-auto"
          autocomplete="off"
          v-model="name"
        />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="$emit('cancel')"
        ></Button>
        <Button
          type="button"
          label="Create"
          @click="$emit('create', name)"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
