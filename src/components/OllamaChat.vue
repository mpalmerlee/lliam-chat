<script setup lang="ts">
import ollama, { type Message, type ChatResponse } from "ollama";
import { ref } from "vue";

const pullModelWithProgress = async (model: string) => {
  const progress = ref(0);
  const pullProgress = await ollama.pull({ model, stream: true });
  for await (const part of pullProgress) {
    progress.value = part.completed;
    console.log(part);
  }
};

const tryChat = async (
  model: string,
  inputMessage: Message,
): Promise<AsyncGenerator<ChatResponse> | undefined> => {
  let response;
  try {
    response = await ollama.chat({
      model,
      messages: [inputMessage],
      stream: true,
    });
  } catch (error: any) {
    console.error(error);
    if (error.status_code === 404) {
      await pullModelWithProgress(model);
      response = await tryChat(model, inputMessage);
      return response;
    }
  }
  return response;
};

const submitChat = async () => {
  const content = messageContent.value;
  messageContent.value = "";
  const inputMessage = { role: "user", content };
  console.log(inputMessage);

  const response = await tryChat("codellama", inputMessage);
  if (!response) return;

  let currentOutputMessage = { role: "ollama", content: "" };
  messages.value.push(currentOutputMessage);
  for await (const part of response) {
    currentOutputMessageContent.value += part.message.content;
    if (part.message.content.endsWith("\n")) {
      console.log(currentOutputMessage.content);
      messages.value.push({
        role: "ollama",
        content: currentOutputMessageContent.value,
      });
      currentOutputMessageContent.value = "";
    }
  }
};

const messageContent = ref("Why is the sky blue?");
const messages = ref([
  { role: "ollama", content: "Hello, I am Ollama. How can I help you?" },
]);
const currentOutputMessageContent = ref("");
</script>

<template>
  <div id="chatBox">
    <div id="chatContainer">
      <div id="chatArea">
        <div v-for="message in messages" :key="message.content">
          <div v-if="message.role === 'user'">
            <div class="userMessage">{{ message.content }}</div>
          </div>
          <div v-else>
            <div class="ollamaMessage">{{ message.content }}</div>
          </div>
        </div>
        <div v-if="currentOutputMessageContent">
          <div class="userMessage">{{ currentOutputMessageContent }}</div>
        </div>
      </div>
    </div>
    <div id="inputArea">
      <Textarea v-model="messageContent" name="chatInput" />
      <Button @click="submitChat">Submit Chat</Button>
    </div>
  </div>
</template>

<style scoped>
#chatBox {
  display: flex;
  height: 100%;
  flex-direction: column;
  /* flex-wrap: wrap;
  align-content: stretch; */
}

#chatContainer {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
}

#chatArea {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
}

#inputArea {
  height: 100px;
  width: 100%;
}
</style>
