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

const { isPending, isFetching, isError, data, error } = useQuery({
  queryKey: ["models"],
  queryFn: getModels,
});
</script>

<template>
  <div id="modelSelectorContainer">
    <div id="modelSelector" class="flex flex-column h-10rem">
      <span class="text-lg font-bold">Model</span>
      <Dropdown
        v-if="data"
        v-model="currentModel"
        editable
        :options="data.models"
        optionLabel="name"
        optionValue="model"
        placeholder="Select a Model"
        class="w-full md:w-14rem"
      />
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
