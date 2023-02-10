<script>
	import NotesCard from "../components/NotesCard.svelte";
	import AddNotes from "../components/AddNotes.svelte";
	import Header from "../components/Header.svelte";
	import notes from "../stores/notesStore";
</script>

<div>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&family=Varela+Round&display=swap" rel="stylesheet">
	<Header/>
	<div class="notes-container">
		<AddNotes/>
		{#each $notes as note,i(note.id)}
			<NotesCard id={note.id} title={note.title} content={note.content} creationDate={note.creationDate} backGroundColor={note.backGroundColor} />
		{/each}
	</div>
	<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
	<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
</div>

<style lang="scss">
	.notes-container{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
        margin: 3rem;
	}
</style>