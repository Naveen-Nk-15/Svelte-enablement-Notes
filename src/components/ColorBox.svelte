<script>
    export let backGroundColor = "#fff";
    export let selectedColor = "#fff";
    $: boxColorStyle = `--box-color:${backGroundColor};`;
    function updateSelectedColor(){
        selectedColor = backGroundColor;
    }
</script>

<div class="box" style={boxColorStyle} on:mousedown={updateSelectedColor}>
    {#if selectedColor === backGroundColor}
        <ion-icon class="check" name="checkmark-outline"></ion-icon>    
    {/if}
</div>

<style lang="scss">
    $box-height: 30px;
    $box-width: 30px;
    .box{
        display: flex;
        width: $box-width;
        height: $box-height;
        cursor: pointer;
        margin: 0 1rem 0 0;
        background-color: var(--box-color);
        text-align: center;
        justify-content: center;
        align-items: center;
    }
</style>