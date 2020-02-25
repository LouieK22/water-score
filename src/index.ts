import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

const app = new Vue({
	render: createElement => createElement(App),
}).$mount("#app");
