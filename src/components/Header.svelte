<script>
    import layout from "../Stores/layout";
    import { header } from "../constants/constants";
    let value = "5";
    layout.subscribe( val => {
        value = val;
    })
    function setLayout(){
        layout.set(value);
    }
</script>




<header class="head">
    <div class="left">{header.title}</div>
    <div class="right">
        <div class="default">{header.defaultView}</div>
        <select bind:value={value} on:change={setLayout} class="dropdown" name="dropdown">
            <option value={header.fiveColumnValue}>{header.fiveColumn}</option>
            <option value={header.twoColumnValue}>{header.twoColumn}</option>
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