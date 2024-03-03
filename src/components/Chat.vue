<script setup lang="ts">
import ollama, { type Message, type ChatResponse } from "ollama";
import { ref, toRefs } from "vue";
import ChatMessage from "./ChatMessage.vue";
import { useModelStore } from "@/stores/model";

const modelStore = useModelStore();
const { currentModel } = toRefs(modelStore);
const chatArea = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (!chatArea.value) return;
  // don't scroll if the user has scrolled up
  if (
    chatArea.value.scrollHeight - chatArea.value.scrollTop >
    chatArea.value.clientHeight + 100
  ) {
    return;
  }
  chatArea.value.scrollTop = chatArea.value.scrollHeight;
};

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

let i = 0;
const submitChat = async (event: Event) => {
  if (
    event instanceof KeyboardEvent &&
    (event.altKey || event.shiftKey || event.ctrlKey)
  ) {
    return;
  }
  const content = messageContent.value;
  messageContent.value = "";
  const inputMessage = { role: "user", content };
  messages.value.push(inputMessage);
  scrollToBottom();

  const response = await tryChat(currentModel.value, inputMessage);
  if (!response) return;

  const appendMessage = () => {
    const content = currentOutputMessageContent.value.trim();
    if (content) {
      console.log(content);
      messages.value.push({
        role: "agent",
        content: content,
      });
      // auto-chat
      // i++;
      // setTimeout(() => {
      //   messageContent.value =
      //     i % 2 === 1
      //       ? `Pose a new question to me based on the main points of this text: \n---\n${content}\n---\n`
      //       : content;
      //   submitChat(event);
      // }, 0);
      scrollToBottom();
    }
    currentOutputMessageContent.value = "";
  };

  for await (const part of response) {
    currentOutputMessageContent.value += part.message.content;
    scrollToBottom();
  }
  appendMessage();
};

const messageContent = ref("Why is the sky blue?");
const messages = ref([
  { role: "agent", content: "Hello, I am Lliam. How can I help you?" },
]);
const currentOutputMessageContent = ref("");
</script>

<template>
  <div id="chatBox">
    <div id="chatContainer">
      <div id="chatArea" ref="chatArea">
        <div v-for="message in messages" :key="message.content">
          <ChatMessage :message="message" />
        </div>
        <div v-if="currentOutputMessageContent">
          <ChatMessage
            :message="{ role: 'agent', content: currentOutputMessageContent }"
          />
        </div>
      </div>
    </div>
    <div id="inputArea">
      <Textarea
        v-model="messageContent"
        @keyup.enter="submitChat"
        id="chatInput"
      />
      <Button @click="submitChat" id="submitButton">Submit</Button>
    </div>
  </div>
</template>

<style scoped>
#chatBox {
  display: flex;
  height: 100%;
  flex-direction: column;
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
  display: flex;
  height: 100px;
  width: 100%;
  padding: 10px;
  align-items: space-between;
}

#chatInput {
  width: calc(100% - 82px);
  height: 100%;
  padding: 10px;
  margin-right: 10px;
}
</style>
