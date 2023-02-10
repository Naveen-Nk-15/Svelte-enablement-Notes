<script>
    export let className;
    export let inverse=true;
</script>

<button class={className} class:inverse={!inverse} on:click>
        <slot/>
</button>

<style lang="scss">
    $form-background-color : #fff;
    $add-button-color: #9a1e13;
     button{
        font-weight: 700;
        font-size: 1.2rem;
        text-transform: uppercase;
        margin: 2rem 1rem 0 0;
        padding: 0.5rem 1.5rem;
        border: 0;
        cursor: pointer;
    }
    .add{
        background-color: $add-button-color;
        color: $form-background-color;
        padding: 0.5rem 2.5rem;
    }
    .no{
        padding: 0.5rem 2.5rem;
    }
</style>