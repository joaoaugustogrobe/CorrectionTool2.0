<template>
  <Modal name="alterar-exercicio" className="teams-settings" title="Newton">
    <template v-slot:tabs>
      <ul>
        <li class="item-title">
          {{ "Configurações do exercício".toUpperCase() }}
        </li>
        <li
          :class="{ active: page === 'configuracoes' }"
          @click="page = 'configuracoes'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'Configurações',
          }"
        >
          <v-icon>mdi-cog</v-icon>
          <span>Configurações</span>
        </li>

        <li
          :class="{ active: page === 'testes' }"
          @click="page = 'testes'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'Testes',
          }"
        >
          <v-icon>fa-code</v-icon>
          <span>Testes</span>
        </li>

        <li
          :class="{ active: page === 'notas' }"
          @click="page = 'notas'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'Testes',
          }"
        >
          <v-icon>fa-sliders</v-icon>
          <span>Notas e tolerancias</span>
        </li>
        
      </ul>
    </template>
    <template class="body" v-slot:header>
      <h1>Teste</h1>
    </template>
    <template class="body" v-slot:body>
      <Notas v-if="page === 'notas'"/>

      <h1 v-else>Teste</h1>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Notas from '../Exercicio/Configuracoes/Notas.vue'

export default {
  data() {
    return {
      page: "configuracoes",
    };
  },
  components: {
    Modal,
    Notas
  },
};
</script>

<style>
</style>