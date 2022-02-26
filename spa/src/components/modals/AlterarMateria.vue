<template>
  <Modal
    name="materia-modal"
    className="materia-modal"
    :title="materia.nome"
    @before-open="onOpen"
  >
    <template v-slot:tabs>
      <ul>
        <li class="item-title">
          {{ "Configurações da matéria".toUpperCase() }}
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
          :class="{ active: page === 'alunos' }"
          @click="page = 'alunos'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'alunos',
          }"
        >
          <v-icon>fa-user</v-icon>
          <span>Alunos</span>
        </li>

        <li
          v-if="false"
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
      <Configuracoes v-if="page === 'configuracoes'" :materia="materia" />
      <Alunos v-else-if="page === 'alunos'" :materia="materia" />

      <h1 v-else>Teste</h1>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Configuracoes from "./Materia/Configuracoes.vue";
import Alunos from "./Materia/Alunos.vue";

import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      page: "configuracoes",
			materiaId: null,
    };
  },
  computed: {
    ...mapGetters('professor', ['obterMateria']),
    materia() {
      return this.obterMateria(this.materiaId) || {};
    },
  },
  components: {
    Modal,
    Configuracoes,
    Alunos,
  },
  methods: {
    onOpen({ params }) {
      if (params) {
        this.materiaId = params.materia._id;
      }
    },
  },
};
</script>

<style>
</style>