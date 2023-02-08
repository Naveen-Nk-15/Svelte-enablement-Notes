import { writable } from 'svelte/store';
const layout = writable(JSON.parse(localStorage.getItem("layout")) || "5");
layout.subscribe(val => localStorage.setItem("layout",JSON.stringify(val)));

export default layout;