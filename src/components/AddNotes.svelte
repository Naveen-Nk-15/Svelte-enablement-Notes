<script>
    import AddNoteForm from "./AddNoteForm.svelte";
    import BackDrop from "./BackDrop.svelte";
    import layout from "../Stores/layout";
    let column;
    let cardHeight;
    let flexMargins;
    layout.subscribe(col => {
        column = col;
        if(col == "2")
        {
            cardHeight = "16rem";
            flexMargins = "66px";
        }
        else{
            cardHeight = "24rem";
            flexMargins = "164px";
        }
    }) 
    console.log(cardHeight + flexMargins);
    $: cardColorStyle = `--card-height:${cardHeight};
                        --margin-constant:${flexMargins};
                        --col:${column};`;
    let popup = false;
    let toggleModal = () =>{
        popup = !popup;
    }
</script>

<button class="notes-card" style={cardColorStyle} on:click={toggleModal}>
    <div class="plus"><ion-icon name="add-circle"></ion-icon></div>
</button>
{#if popup}
    <BackDrop title="new note" on:close-modal={toggleModal}>
        <AddNoteForm on:close-modal={toggleModal} slot="content"/>
    </BackDrop>
{/if}


<style lang="scss">
    $color : #9a1e13;
    $plus-color : #fff;
    .notes-card{
        height: var(--card-height);
        border: 2px solid $color;
        border-style: dashed;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        margin: 1rem;
        width: calc((100% - var(--margin-constant))/var(--col));
        cursor: pointer;
        .plus{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3rem;
            font-size: 7rem;
            color: $color;
        }
    }
</style>
