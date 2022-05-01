<template>
  <Modal
    :title="tituloModal"
    name="feedback-resolucao-aluno"
    class-name="small"
    @before-open="onOpen"
  >
    <template class="body" v-slot:body>
      <div v-if="!resolucaoTestes || !resolucaoTestes.length || aguardandoResolucao">
        <v-card v-for="teste in testes" :key="teste._id" class="mb-2">
          <v-card-text>
            <v-row>
              <v-col class="pr-2" cols="1">
                <v-progress-circular size="24" indeterminate />
              </v-col>
              <v-col>
                <h4>{{ teste.nome }}</h4>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <div v-else>
        <v-card
          v-for="resolucao in resolucaoTestes"
          :key="resolucao._id"
          class="mb-2"
        >
          <v-card-text>
            <v-row>
              <v-col class="pr-2" cols="1">
                <v-icon
                  v-if="!resolucao.testeresolucao.isError"
                  color="green"
                  >check</v-icon
                >
                <v-icon v-else color="red">mdi-alert-circle</v-icon>
              </v-col>
              <v-col>
                <h4>{{ resolucao.nome }}</h4>
                <small v-if="resolucao.testeresolucao.isError">{{
                  resolucao.mensagemErro
                }}</small>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";
import { mapGetters } from "vuex";
export default {
  components: { Modal },
  computed: {
    ...mapGetters("aluno", ["obterExercicio", "obterResolucao"]),
    ...mapGetters("comum", ["obterResolucaoTeste", "obterTestes"]),
    tituloModal() {
      return "Correção em andamento";
    },
    exercicio() {
      return this.obterExercicio({
        exercicioId: this.exercicioId,
        materiaId: this.materiaId,
      });
    },
    resolucao() {
      return this.obterResolucao(this.exercicioId);
    },
    resolucaoTestes() {
      return this.obterResolucaoTeste(this.resolucao?._id);
    },
    versaoCorreta() {
      return this.resolucao.tentativas == this.resolucaoTestes[0].versao;
    },
    testes() {
      return this.obterTestes(this.exercicio._id);
    },
  },
  data() {
    return {
      materiaId: null,
      exercicioId: null,
      aguardandoResolucao: true,
    };
  },
  methods: {
    onOpen({ params }) {
      this.exercicioId = params.exercicio._id;
      this.materiaId = params.exercicio.materia;
    },
  },
  watch: {
    resolucao: {
      immediate: true,
      deep: true,
      handler(resolucao) {
        if (resolucao.status == "ok") {
          this.aguardandoResolucao = false;
        }
      },
    },
  },
};
</script>

<style>
</style>