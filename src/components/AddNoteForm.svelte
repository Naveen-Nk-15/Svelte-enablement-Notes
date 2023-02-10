<script>
    import ColorBox from "./ColorBox.svelte";
    import colors from "../Stores/box-color";
    import notes from "../Stores/notes-store"
    import { each } from "svelte/internal";
    import { get } from "svelte/store";
    import { createEventDispatcher } from "svelte";
    import {addForm} from "../constants/constants"
    import { nanoid } from 'nanoid';
    import Button from "./Button.svelte";
    const dispatch = createEventDispatcher();
    let allNotes = get(notes);
    let id = nanoid();
    let title = "";
    let content = "";
    let selectedColor = get(colors)[0].backGroundColor;
    const options = { month: "short" };
    function modalClose()
    {
        dispatch("closeModal");
    }
    function addCard(event)
    {
        var date = new Date()
        let createdBy=date.getDate()+" "+date.toLocaleString('default',options); 
        notes.update( notes =>{
            return [{
                id,
                title,
                content,
                backGroundColor : selectedColor,
                creationDate : createdBy
            },...notes ]
        })
        dispatch("closeModal");
    }
    
</script>


    <form class="form" action="" on:submit|preventDefault={addCard}>
        <div class="heading">
            <input type="text" bind:value={title} required placeholder={addForm.headingPlaceHolder}>
        </div>
        <div class="content">
            <textarea name="content" bind:value={content} required id="" cols={addForm.contentCols} placeholder={addForm.contentPlaceHolder} rows={addForm.contentCols}></textarea>
        </div>
        <div class="footer">
            <p>{addForm.background}</p>
            {#each $colors as color}
                <ColorBox backGroundColor={color.backGroundColor} bind:selectedColor={selectedColor}/>    
            {/each}
        </div>
        <div class="button">
            <Button  on:click={modalClose} >{addForm.cancelButton}</Button>
            <Button className="add">{addForm.addButton}</Button>
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
    }

</style>