<script>
    import layout from "../Stores/layout";

    let value;
    layout.subscribe( val => {
        value = val;
    })
    function setLayout(){
        layout.set(value);
    }
</script>




<header class="head">
    <div class="left">pocket notes</div>
    <div class="right">
        <div class="default">default view</div>
        <select bind:value={value} on:change={setLayout} class="dropdown" name="dropdown">
            <option value="5">5 Column Format</option>
            <option value="2">2 Column Format</option>
        </select>
    </div>
</header>

<style lang="scss">
    $head-color : #fff;
    $nav-background-color : #9a1e13;
.head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 4rem;
    background-color: $nav-background-color;
    color: $head-color;
    .left{
        font-size: 2rem;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
    }
    .right{
        display: flex;
        align-items: center;
        text-transform: capitalize;
        .default{
            font-weight: 700;
            margin: 0 1rem 0 0;
        }
        .dropdown{
            font-size: 1.2rem;
            padding: 0.5rem 1rem;
            width: 15rem;
        }
    }
}
</style>