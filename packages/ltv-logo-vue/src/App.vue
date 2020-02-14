<template>
  <div id="app">
    <logo :size="10" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Logo from './components/Logo.vue';

@Component({
  components: { Logo }
})
export default class App extends Vue {}
</script>
