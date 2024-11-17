<template>
  <div id="app">
    <header class="header-container">
      <TheHeader :slotContent="slotContent" @update:slotContent="updateTitle"></TheHeader>
    </header>
    <router-view></router-view>
    <TheFooter/>
  </div>
</template>

<script>
import TheHeader from '../src/components/layout/TheHeader.vue';
import TheFooter from '../src/components/layout/TheFooter.vue';

export default {
  components: { TheHeader,TheFooter },
  data() {
    return {
      slotContent: 'Default Slot'
    }
  },
  methods: {
    updateTitle(content) {
      this.slotContent = content;
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Prompt');

#app {
  background: url('https://i.postimg.cc/TYMs9Sqc/gym-bg.png') no-repeat center center/cover;
  height: 120vh;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: 'Prompt', sans-serif;
}

.header-container {
  background-color: rgba(0, 0, 0, 0.5);
}

</style>