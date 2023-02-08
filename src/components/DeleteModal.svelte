<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let modalContent = "Deleting this note will remove all its traces from the system and cannote be rolled back. Do you really wish to delete this note?";
    function cancel(){
        dispatch("cancel");
    }
    function remove(){
        dispatch("remove");
    }
</script>

<div>
    <div class="content">
        {modalContent}
    </div>
    <div class="button">
        <button on:click={cancel} class="no">no</button>
        <button on:click={remove} class="add">yes</button>
    </div>
</div>

<style lang="scss">
    $form-background-color : #fff;
    $add-button-color: #9a1e13;

    .content{
        text-align: justify;
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
        .no{
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