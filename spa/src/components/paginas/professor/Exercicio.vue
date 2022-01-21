<template>
  <div class="exercicio">
    <v-container class="my-5">
      <v-card :loading="carregando" :class="`px-2 my-3`">
        <v-flex>
          <card-exercicio
            flat
            class="px-2 my-3"
            :exercicioNome="exercicio.titulo"
            :materiaNome="exercicio.materia.nome"
            :submissoes="exercicio.submissoesCount"
            :dataFinal="exercicio.prazo"
            :status="exercicio.status"
          />
        </v-flex>
        <v-container>
          <span>{{exercicio.descricao}}</span>
        </v-container>
        <v-flex>
          <v-stepper v-model="stepperAtivo">
            <v-stepper-header>
              <template v-for="n in testes.length">
                <v-stepper-step
                  :key="`${n}-step`"
                  :complete="stepperAtivo > n"
                  :step="n"
                  edit-icon="arrow_drop_down"
                  editable
                >Teste {{n}}</v-stepper-step>
                <v-divider v-if="n !== testes.length" :key="n"></v-divider>
              </template>
              <v-divider key="divider"></v-divider>
              <v-stepper-step
                key="addStep"
                :complete="stepperAtivo > testes.length + 1"
                step="+"
                editable
              >
                <span>Adicionar novo teste</span>
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content v-for="n in testes.length" :key="`${n}-content`" :step="n">
                  <span class="title">Entrada:</span>
                  <v-row align="start">
                    <v-col v-for="(teste, i) in testes[n - 1].input" :key="i" md="2">
                      <v-text-field :value="teste" outlined readonly></v-text-field>
                    </v-col>
                  </v-row>
                <span class="title">Saida:</span>
                <v-textarea rows="1" :value="testes[n-1].output" outlined readonly></v-textarea>
                <div v-if="testes[n-1].isPrivate">
                  <v-icon small>lock</v-icon>
                  <span>Este teste é privado</span>
                </div>
              </v-stepper-content>
              <v-stepper-content step="+">
                <v-form ref="form">
                  <span class="title">Entrada:</span>
                  {{testeSendoAdicionado.input}}
                    <v-row align="start">
                      <v-col
                        md="2"
                        v-for="i in testeSendoAdicionado.input.length + 1"
                        :key="i"
                        class="mr-2"
                      >
                        <v-text-field
                          v-model="testeSendoAdicionado.input[i-1]"
                          outlined
                          :label="`Argumento ${i}`"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="1">
                        <v-btn text fab @click="testeSendoAdicionado.input.pop()">
                          <v-icon>remove</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-textarea
                          v-model="testeSendoAdicionado.output"
                          outlined
                          rows="3"
                          :rules="rules"
                        ></v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-checkbox v-model="testeSendoAdicionado.isPrivate" label="Teste privado"></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row justify="end">
                      <v-col class="mx-2" md="1">
                        <v-btn @click="limparForm">Limpar</v-btn>
                      </v-col>
                      <v-col md="1">
                        <v-btn class="success" @click="adicionarTeste" :loading="salvandoTeste">
                          <v-icon>add</v-icon>Salvar
                        </v-btn>
                      </v-col>
                    </v-row>
                </v-form>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-flex>
        <div v-if="!carregando" class="mt-4">
          <ListagemSubmissoes :submissoes="submissoes"/>
        </div>
      </v-card>
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
import {mapGetters} from 'vuex';

import ListagemSubmissoes from '../../submissao/ListagemSubmissoes.vue';

axios.defaults.withCredentials = true;

export default {
  name: 'Exercicio',
  mixins: [dataMixin],
  computed: {
    ...mapGetters('professor', ['obterMateria']),
    materia(){
      return this.obterMateria(this.exercicio?.materia?._id);
    },
  },
  data() {
    return {
      stepperAtivo: 1,
      backendConfig: backend,
      carregando: true,
      salvandoTeste: false,
      exercicio: {
        descricao: "",
        materia: { nome: "" },
        submissoesCount: "",
        prazo: "",
        status: ""
      },
      submissoes: [
        {
          aluno: { nome: "" },
          status: "",
          tentativas: 0
        }
      ],
      testeSendoAdicionado: {
        input: [],
        output: "",
        isPrivate: false
      },
      testes: [],
      rules: [value => !!value || "Obrigatório."]
    };
  },
  components: {
    "card-exercicio": CardExercicio,
    "card-submissao": CardSubmissao,
    ListagemSubmissoes,
  },
  methods: {
    onEdit(){
      this.$modal.show("alterar-exercicio");
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
        isPrivate: false
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
    }
  },
  created() {
    const promisses = [
      axios.get(`${backend.uri}/${this.$route.params.id}/show`).then(res => {
        this.exercicio = res.data.data.exercicio;
      }),
      this.$store.dispatch('professor/obterMateria', {materiaId: this.exercicio.materia._id}),
      axios
        .get(`${backend.uri}/resolucoes/${this.$route.params.id}`)
        .then(res => {
          this.submissoes = res.data.data.resolucoes;
        }),
      axios
        .get(`${backend.uri}/exercicio/${this.$route.params.id}/testes`)
        .then(res => {
          this.testes = res.data.data.testes;
        })
    ];

    Promise.all(promisses).then(() => {
      this.carregando = false;
      this.$store.dispatch('professor/obterMateria', {materiaId: this.exercicio.materia._id});
    });
  }
};
</script>

<style>
</style>