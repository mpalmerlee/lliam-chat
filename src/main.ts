import "./assets/main.css";
import "github-markdown-css/github-markdown.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import "primevue/resources/themes/aura-light-green/theme.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Textarea from "primevue/textarea";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(PrimeVue);
app.use(createPinia());
app.use(router);

app.component("Button", Button);
app.component("Textarea", Textarea);

app.mount("#app");
