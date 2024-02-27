<script setup lang="ts">
import { onMounted, ref, toRef, toRefs } from "vue";
import ollama, { type ListResponse } from "ollama";
import { useQuery } from "@tanstack/vue-query";
import { useModelStore } from "@/stores/model";

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);

const getModels = async () => {
  const response = await ollama.list();
  return response;
};

const { isPending, isError, data, error } = useQuery({
  queryKey: ["models"],
  queryFn: getModels,
});
</script>

<template>
  <div id="modelSelectorContainer">
    <div id="modelSelector" class="flex flex-column h-10rem">
      <span class="text-lg font-bold">Model</span>
      <div v-if="isPending">
        <Dropdown
          placeholder="Loading Models..."
          loading
          class="w-full md:w-14rem"
        ></Dropdown>
      </div>
      <div v-else-if="isError">An error has occurred: {{ error }}</div>
      <div v-else-if="data" class="flex">
        <Dropdown
          v-model="currentModel"
          :options="data.models"
          optionLabel="name"
          optionValue="model"
          placeholder="Select a Model"
          class="w-full md:w-14rem"
        />
        <Button icon="pi pi-plus" aria-label="Add Model" class="ml-2" />
      </div>
      <div id="progressArea" class="mt-2">
        <ProgressBar :value="40"> 40/100 </ProgressBar>
      </div>
    </div>
  </div>
</template>

<style scoped>
#modelSelectorContainer {
  display: flex;
}

#modelSelector {
  width: 100%;
  margin: 1rem;
}
</style>
