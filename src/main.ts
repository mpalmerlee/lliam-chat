import "./assets/main.css";
import "github-markdown-css/github-markdown.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";

import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Avatar from "primevue/avatar";
import Dropdown from "primevue/dropdown";
import ProgressBar from "primevue/progressbar";

import "primevue/resources/themes/aura-light-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(PrimeVue);
app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);

app.component("Button", Button);
app.component("Textarea", Textarea);
app.component("Avatar", Avatar);
app.component("Dropdown", Dropdown);
app.component("ProgressBar", ProgressBar);

app.mount("#app");
