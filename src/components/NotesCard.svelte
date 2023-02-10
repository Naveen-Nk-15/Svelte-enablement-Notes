<script>
    import { cardDimensions } from "../constants/constants";
    import notes from "../stores/notesStore"
    import BackDrop from "./Modal.svelte";
    import DeleteModal from "./DeletePopup.svelte";
    import layout from "../Stores/layout";
    export let id = null;
    export let title = "";
    export let content = "Please add some";
    export let creationDate = "";
    export let backGroundColor = "";
    let column = "5";
    let contentheight = cardDimensions.fiveColContentHeight;
    let cardHeight = cardDimensions.fiveColCardHeight;
    let flexMargins = cardDimensions.fiveColFlexMargins;
    let deletingId = null;
    let popup = false;
    layout.subscribe(col => {
        column = col;
        if(col == "2")
        {
            cardHeight = cardDimensions.twoColCardHeight;
            flexMargins = cardDimensions.twoColFlexMargins;
            contentheight = cardDimensions.twoColContentHeight;
        }
        else{
            cardHeight = cardDimensions.fiveColCardHeight;
            flexMargins = cardDimensions.fiveColFlexMargins;
            contentheight = cardDimensions.fiveColContentHeight;
        }
    }) 
    $: cardColorStyle = `--note-color:${backGroundColor};
                        --card-height:${cardHeight};
                        --margin-constant:${flexMargins};
                        --col:${column};
                        --content-height:${contentheight}`;
    function deleteCard (){
        toggleModal();
        notes.update(notes =>{
            return notes.filter((note)=>note.id!== deletingId)
        })
    }
    function deleteMyNote(selectedId)
    {
        deletingId = selectedId;
        toggleModal()
    }
    let toggleModal = () =>{
        popup = !popup;
    }
</script>

<div data-index={id} class="notes-card" style={cardColorStyle}>
    <h1 class="header">{title}</h1>
    <p class="content">{content}</p>
    <div class="footer">
        <div class="date">{creationDate}</div>
        <ion-icon on:mousedown={()=>{deleteMyNote(id)}} class="delete" name="trash-outline"></ion-icon>
    </div>
</div>
{#if popup}
    <BackDrop title="confirm delete" on:close-modal={toggleModal}>
       <DeleteModal on:cancel={toggleModal} on:remove={deleteCard} slot="content"/>
    </BackDrop>
{/if}


<style lang="scss">
	$card-height-5-col : 24rem;
    $card-height-2-col : 16rem;
    $date-color : #858586;
    .notes-card{
        height: var(--card-height);
        background-color: var(--note-color);
        margin: 1rem;
        width: calc((100% - var(--margin-constant))/var(--col));
        .header{
            padding: 0.5rem 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 300;
            text-transform: capitalize;
            background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
            margin: 0;
            width: auto;
        }
        .content{
            padding: 1rem;
            margin: 0;
            height: var(--content-height);
            overflow-y: scroll;
            text-align: justify;
        }
        .footer{
            padding: 1rem;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .date{
                font-size: 10px;
                vertical-align: bottom;
                font-weight: 500;
                text-transform: uppercase;
                color: $date-color;
            }
            .delete{
                cursor: pointer;
            }
        }
    }
</style>