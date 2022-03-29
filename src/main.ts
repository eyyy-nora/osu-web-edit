import { parse } from "./client";
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

parse().then(console.log);

export default app;
