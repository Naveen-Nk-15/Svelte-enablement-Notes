import { writable } from 'svelte/store';

const colors = writable([
    {
        id:1,
        backGroundColor: "#c2e891",
    },
    {
        id:2,
        backGroundColor: "#d5e2f6",
    },
    {
        id:3,
        backGroundColor: "#dededf",
    },
    {
        id:4,
        backGroundColor: "#d9cdcf",
    }
]);

export default colors;