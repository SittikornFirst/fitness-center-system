<template>
    <div class="page">
        <section class="hero">
            <h1>FITNESS <br>CENTER SYSTEM</h1>
            <a href="#" class="cta">WWW.FITNESSCENTERSYSTEM.COM</a>
        </section>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
};
</script>

<style scoped>
.page {
    height: 100vh;
    color: #ffffff;
    display: flex;
    flex-direction: column;
}

.hero {
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
}

.hero h1 {
    font-family: Impact;
    letter-spacing: .5vh;
    font-size: 8rem;
    margin: 0;
}

.cta {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #ff0000;
    color: #fff;
    font-weight: bold;
    font-family: sans-serif;
    text-decoration: none;
}
</style>