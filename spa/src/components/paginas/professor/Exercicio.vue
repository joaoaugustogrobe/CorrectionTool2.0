<template>
  <div class="exercicio">
    <v-container class="my-5">
      <v-flex>
        <v-card>
          <v-card-title
            >{{ exercicio.titulo }} · {{ assinaturaFuncao }}</v-card-title
          >
          <v-card-subtitle
            ><v-badge
              inline
              color="red"
              dot
              v-if="minutosAPartirDeHoje(exercicio.prazo) > 0"
            />{{ displayData(exercicio.prazo) }} ·
            {{ dataRelativa(exercicio.prazo) }}</v-card-subtitle
          >
          <v-card-text>
            <v-row align="center" class="mx-0" v-if="!exercicio.visivel">
              <v-badge inline color="red" dot></v-badge>
              <span>Este exercício não esta visivel para alunos</span>
            </v-row>
            <v-row>
              <span class="exercicio-descricao">{{ exercicio.descricao }}</span>
            </v-row>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-container> </v-container>
      <v-card>
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
                  >{{ teste.nome }}</v-stepper-step
                >
                <v-divider
                  v-if="index !== testes.length"
                  :key="index"
                ></v-divider>
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
      </v-card>

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
      if (!this.exercicio.materia) return {};
      return this.obterMateria(this.exercicio?.materia?._id);
    },
    submissoes() {
      return this.$store.getters["professor/obterTodasSubmissoesExercicio"](
        this.exercicio._id,
        this.materia._id
      );
    },
    exercicioId() {
      return this.$route.params.id;
    },
    exercicio() {
      return this.$store.getters["professor/obterExercicio"](this.exercicioId);
    },
    testes() {
      return this.obterTestes(this.exercicioId);
    },
    assinaturaFuncao() {
      const parametros = this.exercicio?.assinatura?.reduce(
        (anterior, input) => {
          return anterior ? `${anterior}, ${input}` : input;
        },
        ""
      );

      // const assinatura = `${this.exercicio.nomeFuncao}(${parametros})`;
      return `${this.exercicio.nomeFuncao}(${parametros})`;
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
      this.$modal.show("alterar-exercicio", { exercicio: this.exercicio });
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

      this.$store.dispatch("professor/obterTestesExercicio", { exercicioId });

      await this.$store.dispatch("professor/obterSubmissoes", {
        exercicioId: exercicioId,
      });

      await this.$store.dispatch("professor/obterMateria", {
        materiaId: this.exercicio.materia._id,
      });

      this.carregando = false;
    },
    onAbrirTestes() {
      this.$modal.show("alterar-exercicio", {
        tab: "testes",
        exercicio: this.exercicio,
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
.exercicio-descricao{
  padding: 1rem;
  white-space: pre-wrap;
}
</style>