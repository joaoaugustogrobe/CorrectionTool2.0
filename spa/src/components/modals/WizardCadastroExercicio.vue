<template>
  <Modal
    name="cadastro-exercicio"
    className="l"
    title="Cadastrar novo exercício"
    @before-open="onOpen"
  >
    <template class="body" v-slot:body>
      <v-container>
        <v-stepper v-model="step" vertical>
          <v-stepper-step :step="1">Dados do exercício</v-stepper-step>
          <v-stepper-content :step="1">
            <StepCadastro @step="onProximoPasso" />
          </v-stepper-content>
          <v-stepper-step :step="2">Detalhes da função</v-stepper-step>
          <v-stepper-content :step="2">
            <StepFuncao :exercicio="exercicio" @step="onProximoPasso" />
          </v-stepper-content>
          <v-stepper-step :step="3">Configuração de testes</v-stepper-step>
					<v-stepper-content :step="3">
            <StepTeste :exercicio="exercicio" @step="onProximoPasso" />
          </v-stepper-content>
        </v-stepper>
      </v-container>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import StepCadastro from "./CadastroExercicio/StepCadastro.vue";
import StepFuncao from "./CadastroExercicio/StepFuncao.vue";
import StepTeste from "./CadastroExercicio/StepTeste.vue";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      page: "configuracoes",
      materiaId: null,
      step: 1,
      exercicio: {},
    };
  },
  computed: {
    ...mapGetters("professor", ["obterMateria"]),
    materia() {
      return this.obterMateria(this.materiaId) || {};
    },
  },
  components: {
    Modal,
    StepCadastro,
    StepFuncao,
		StepTeste,
  },
  methods: {
    onOpen() {
      (this.step = 1), (this.exercicio = {});
    },
    onProximoPasso({ step, exercicio }) {
      this.step = step;
      this.exercicio = exercicio;
    },
  },
  created() {
    this.$store.dispatch("professor/obterMaterias");
  },
};
</script>

<style>
</style>
