<script>
    import ColorBox from "./ColorBox.svelte";
    import colors from "../Stores/box-color";
    import notes from "../Stores/notes-store"
    import { each } from "svelte/internal";
    import { get } from "svelte/store";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let allNotes = get(notes);
    let id = allNotes[allNotes.length-1] ? allNotes[allNotes.length-1].id+1 : 1;
    let title = "";
    let content = "";
    let selectedColor = get(colors)[0].backGroundColor;
    const month = ["jan","feb","mar","apr","may","jun","jul","aug","sept","oct","nov","dec"]
    function modalClose()
    {
        dispatch("close-modal");
    }
    function addCard(event)
    {
        var date = new Date()
        let createdBy=date.getDate()+" "+month[date.getMonth()]; 
        notes.update( notes =>{
            return [...notes, {
                id : id,
                title : title,
                content : content,
                backGroundColor : selectedColor,
                creationDate : createdBy
            }]
        })
        dispatch("close-modal");
    }
    
</script>


    <form class="form" action="" on:submit|preventDefault={addCard}>
        <div class="heading">
            <input type="text" bind:value={title} required placeholder="Note Title">
        </div>
        <div class="content">
            <textarea name="content" bind:value={content} required id="" cols="15" placeholder="Say Something" rows="7"></textarea>
        </div>
        <div class="footer">
            <p>notes background</p>
            {#each $colors as color}
                <ColorBox backGroundColor={color.backGroundColor} bind:selectedColor={selectedColor}/>    
            {/each}
        </div>
        <div class="button">
            <button on:click|preventDefault={modalClose}>cancel</button>
            <button  class="add">add</button>
        </div>
    </form>
    

<style lang="scss">
    $form-background-color : #fff;
    $add-button-color: #9a1e13;
    .form{
        input{
            display: block;
            width: 100%;
            padding: 1rem;
            margin: 0 0 1rem 0;
            font-size: 1.3rem;
            border: 1px solid black;
        }   
        textarea{
            display: block;
            padding: 1rem;
            font-size: 1.3rem;
            margin: 0 0 1rem 0;
            width: 100%;
            border: 1px solid black;
        }
        .footer{
        display: flex;
        align-items: center;
        text-transform: capitalize;
        p{
            margin: 0 2rem 0 0;
        }
    }
    }
    
    .button{
        display: flex;
        align-items: center;
        justify-content: center;
        .add{
            background-color: $add-button-color;
            color: $form-background-color;
            padding: 0.5rem 2.5rem;
        }
        button{
            font-weight: 700;
            font-size: 1.2rem;
            text-transform: uppercase;
            margin: 2rem 1rem 0 0;
            padding: 0.5rem 1.5rem;
            border: 0;
            cursor: pointer;
        }
    }

</style>