import { hello } from "./client";
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

hello().then(console.log);

export default app;
