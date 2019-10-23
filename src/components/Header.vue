<template>
    <header class="main-header">
        <h4>Test Dev Frontend</h4>
    </header>    
</template>

<script>
export default {
  name: 'main-header'
}
</script>

<style scoped>
    header.main-header {
        width: 100%;
        height: 56px;
        background-color: #343C58;
        position: absolute;        
        left: 0%;
        top: 0%;
        color: #FFFFFF;
    }

    header > h4 {        
        width: 161px;
        height: 24px;
        left: 26px;
        margin: 1.1rem 2rem;
        font-weight: lighter;
    }
</style>
