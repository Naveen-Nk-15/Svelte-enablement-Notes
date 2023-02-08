<script>
    import { createEventDispatcher } from "svelte";
    export let title;
    const dispatch = createEventDispatcher();
    function modalClose()
    {
        dispatch("close-modal");
    }
</script>

<div class="modal-backdrop" on:mousedown={modalClose}></div>
<div class="modal">
    <div class="header">{title}</div>
    <div class="content">
        <slot name="content"/>
    </div>
    <footer class="footer">
        <slot name="footer"/>
    </footer>
</div>
<style lang="scss">
    $form-background-color : #fff;
    $add-button-color: #9a1e13;
.modal{
    position: absolute;
    z-index: 2;
    width: 45%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    background-color: $form-background-color;
    .header{
        text-align: center;
        text-transform: capitalize;
        font-weight: 500;
        font-size: 1.5rem;
        padding: 0 0 1rem 0;
    }
    .footer{
        display: flex;
        align-items: center;
        text-transform: capitalize;
    }
}
.modal-backdrop{
    position: fixed; 
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgba(0,0,0,0.2); 
}
</style>