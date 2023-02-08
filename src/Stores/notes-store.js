import { writable } from 'svelte/store';
const notes = writable(JSON.parse(localStorage.getItem("notes")) || "");
notes.subscribe(val => localStorage.setItem("notes",JSON.stringify(val)));


// commented for example object skeleteon
// const notes = writable([
//     {
//         id : 1,
//         title : "my title",
//         content : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         creationDate: "24 Dec",
//         backGroundColor: "#dededf",
//     },
// ]);

export default notes;