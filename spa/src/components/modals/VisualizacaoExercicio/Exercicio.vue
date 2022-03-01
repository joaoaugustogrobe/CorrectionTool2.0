<template>
  <Modal
    name="visualizar-exercicio"
    className="visualizar-exercicio"
    :title="exercicio && exercicio.titulo"
    @before-open="onOpen"
  >
    <!-- <template v-slot:tabs>
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
    </template> -->
    <template class="body" v-slot:header>
      <h1>Teste</h1>
    </template>
    <template class="body" v-slot:body>
      <Resolucao :submissao="submissao" v-if="submissao && submissao._id"/>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import Resolucao from "../../template/ResolucaoItem.vue";

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
    Resolucao,
  },
  computed: {
    ...mapGetters("aluno", ["obterExercicio", "obterResolucao"]),
    // materia() {
    //   return this.obterMateria(this.materiaId) || {};
    // },
    exercicio() {
      return this.obterExercicio({exercicioId: this.exercicioId, materiaId: this.materiaId});
    },
    submissao() {
      return this.obterResolucao(this.exercicioId);
    }
  },
  methods: {
    async onOpen({ params }) {
      if (params) {
        this.exercicioId = params.exercicio._id;
        this.materiaId = params.exercicio.materia;
        this.page = params.tab ? params.tab : 'configuracoes';

        await this.$store.dispatch('aluno/obterResolucao', this.exercicioId);

      }
    },
  },
};
</script>

<style>
</style>