<template>
  <Modal
    name="alterar-exercicio"
    className="alterar-exercicio"
    :title="exercicio && exercicio.titulo"
    @before-open="onOpen"
  >
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
          v-if="false"
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
      <Notas v-if="page === 'notas'" />
      <Configuracoes
        v-else-if="page === 'configuracoes'"
        :exercicio="exercicio"
      />
      <Testes v-else-if="page === 'testes'" :exercicio="exercicio" />

      <h1 v-else>Teste</h1>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import Notas from "../Exercicio/Configuracoes/Notas.vue";
import Configuracoes from "./Exercicio/Configuracoes.vue";
import Testes from "./Exercicio/Testes.vue";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      page: "configuracoes",
      materiaId: null,
      exercicioId: null,
    };
  },
  components: {
    Modal,
    Notas,
    Testes,
    Configuracoes,
  },
  computed: {
    ...mapGetters("professor", ["obterMateria", "obterExercicio"]),
    materia() {
      return this.obterMateria(this.materiaId) || {};
    },
    exercicio() {
      return this.obterExercicio(this.exercicioId);
    },
  },
  methods: {
    onOpen({ params }) {
      if (params) {
        this.exercicioId = params.exercicio._id;
        this.page = params.tab ? params.tab : 'configuracoes';
      }
    },
  },
};
</script>

<style>
</style>