<script>
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";
    import { deletePopup } from "../constants/constants";
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
        <Button on:click={cancel} className="no">{deletePopup.noButton}</Button>
        <Button on:click={remove} className="add">{deletePopup.yesButton}</Button>
    </div>
</div>

<style lang="scss">
    .content{
        text-align: justify;
    }
    .button{
        display: flex;
        align-items: center;
        justify-content: center;   
    }
</style>