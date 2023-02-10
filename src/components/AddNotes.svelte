<script>
    import AddNoteForm from "./AddNoteForm.svelte";
    import BackDrop from "./Modal.svelte";
    import layout from "../Stores/layout";
    import {cardDimensions} from "../constants/constants"
    let column = "5";
    let cardHeight = cardDimensions.fiveColCardHeight;
    let flexMargins = cardDimensions.fiveColFlexMargins;
    layout.subscribe(col => {
        column = col;
        if(col == "2")
        {
            cardHeight = cardDimensions.twoColCardHeight;
            flexMargins = cardDimensions.twoColFlexMargins;
        }
        else{
            cardHeight = cardDimensions.fiveColCardHeight;
            flexMargins = cardDimensions.fiveColFlexMargins;
        }
    }) 
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
    <BackDrop title="new note" on:closeModal={toggleModal}>
        <AddNoteForm on:closeModal={toggleModal} slot="content"/>
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
