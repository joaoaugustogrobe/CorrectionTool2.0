<template>
  <div class="exercicio">
    <v-container class="my-5">
        <v-flex>
          <card-exercicio
            flat
            class="px-2 my-3"
            :exercicioNome="exercicio && exercicio.titulo"
            :materiaNome="materia && materia.nome || ''"
            :submissoes="exercicio && exercicio.submissoesCount"
            :dataFinal="exercicio && exercicio.prazo"
            :status="exercicio && exercicio.status"
          />
        </v-flex>
        <v-container>
          <span>{{ exercicio.descricao }}</span>
        </v-container>
        <v-flex>
          <v-stepper v-model="stepperAtivo">
            <v-stepper-header>
              <template v-for="(teste, index) in testes">
                <v-stepper-step
                  :key="`${index}-step`"
                  :complete="stepperAtivo > index"
                  :step="index"
                  edit-icon="arrow_drop_down"
                  editable
                  @click="onAbrirTestes"
                  >{{teste.nome}}</v-stepper-step
                >
                <v-divider v-if="index !== testes.length" :key="index"></v-divider>
              </template>
              <v-divider key="divider"></v-divider>
              <v-stepper-step
                key="addStep"
                :complete="stepperAtivo > testes.length + 1"
                step="+"
                editable
                @click="onAbrirTestes"
              >
                <span>Adicionar teste</span>
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-flex>
        <div v-if="!carregando" class="mt-4">
          <ListagemSubmissoes :submissoes="submissoes" />
        </div>
    </v-container>
    <v-btn class="amber accent-3" fixed bottom right fab @click="onEdit">
      <v-icon>edit</v-icon>
    </v-btn>
  </div>
</template>

<script>
import dataMixin from "../../../util/date";
import CardExercicio from "../../template/CardExercicio";
import CardSubmissao from "../../template/CardSubmissao";
import backend from "../../../backend";
import axios from "axios";
import { mapGetters } from "vuex";

import ListagemSubmissoes from "../../submissao/ListagemSubmissoes.vue";

axios.defaults.withCredentials = true;

export default {
  name: "Exercicio",
  mixins: [dataMixin],
  computed: {
    ...mapGetters("professor", ["obterMateria", "obterTestes"]),
    materia() {
      if(!this.exercicio.materia) return {};
      return this.obterMateria(this.exercicio?.materia?._id);
    },
    submissoes() {
      return this.$store.getters["professor/obterTodasSubmissoesExercicio"](
        this.exercicio._id,
        this.materia._id
      );
    },
    exercicioId(){
      return this.$route.params.id;
    },
    exercicio() {
      return this.$store.getters["professor/obterExercicio"](this.exercicioId);
    },
    testes() {
      return this.obterTestes(this.exercicioId);
    },
  },
  data() {
    return {
      stepperAtivo: 0,
      backendConfig: backend,
      carregando: true,
      salvandoTeste: false,
      testeSendoAdicionado: {
        input: [],
        output: "",
        isPrivate: false,
      },
      rules: [(value) => !!value || "Obrigatório."],
    };
  },
  components: {
    "card-exercicio": CardExercicio,
    "card-submissao": CardSubmissao,
    ListagemSubmissoes,
  },
  methods: {
    onEdit() {
      this.$modal.show("alterar-exercicio", {exercicio: this.exercicio});
    },
    log(a) {
      /* eslint-disable no-console */
      console.log(a);
      /* eslint-enable no-console */
    },
    limparForm() {
      this.$refs.form.reset();
      this.testeSendoAdicionado = {
        input: [],
        output: "",
        isPrivate: false,
      };
    },
    adicionarTeste() {
      if (this.$refs.form.validate()) {
        this.salvandoTeste = true;
        let testeClone = JSON.parse(JSON.stringify(this.testeSendoAdicionado));
        this.testes.push(testeClone);
        testeClone.exercicioId = this.$route.params.id;
        axios.post(`${backend.uri}/testes/create`, testeClone).then(() => {
          this.salvandoTeste = false;
          this.limparForm();
        });
      }
    },
    async init() {
      const exercicioId = this.$route.params.id;

      this.$store.dispatch('professor/obterTestesExercicio', {exercicioId});

      await this.$store.dispatch("professor/obterSubmissoes", {
        exercicioId: exercicioId,
      });

      await this.$store.dispatch("professor/obterMateria", {
        materiaId: this.exercicio.materia._id,
      });

      this.carregando = false;
    },
    onAbrirTestes(){
      this.$modal.show('alterar-exercicio', {tab: 'testes', exercicio: this.exercicio});
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>