<template>
  <v-container>
    <v-card :loading="carregando">
      <v-card-text>
        <span class="title black--text">{{materia.nome}}</span>
        <v-btn v-tooltip="'test'">Sair</v-btn>
        <v-expansion-panels class="mt-3">
          <v-expansion-panel
            @change="onExpansionChange(exercicio)"
            :class="`${exercicio.prazo - new Date().getTime() > 0 ? 'adiantado' : 'atrazado'}`"
            v-for="exercicio in exercicios"
            :key="exercicio._id"
          >
            <v-expansion-panel-header>
              <v-row class="pa-0" justify="space-between">
                <v-col class="pa-0" md="4">
                  <span class="font-weight-bold subtitle-1">{{exercicio.titulo}}</span>
                </v-col>
                <v-col class="pa-0" md="2">
                  <v-icon
                    :color="`${exercicio.prazo - new Date().getTime() > 0 ? 'green' : 'red'}`"
                  >alarm</v-icon>
                  <span
                    :class="`${exercicio.prazo - new Date().getTime() > 0 ? 'green--text' : 'red--text'}`"
                  >{{converterData(exercicio.prazo)}}</span>
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>{{exercicio.descricao}}</p>
              <div v-if="exercicio.testes && exercicio.testes.length > 0">
                <h3>Testes</h3>
                <v-stepper v-model="testeAtivo" class="my-4">
                  <v-stepper-header>
                    <template v-for="n in exercicio.testes.length">
                      <v-stepper-step
                        :key="`${n}-step`"
                        :complete="testeAtivo > n"
                        :step="n"
                        edit-icon="arrow_drop_down"
                        editable
                      >Teste {{n}}</v-stepper-step>
                      <v-divider v-if="n !== exercicio.testes.length" :key="n"></v-divider>
                    </template>
                  </v-stepper-header>

                  <v-stepper-items>
                    <v-stepper-content
                      v-for="n in exercicio.testes.length"
                      :key="`${n}-content`"
                      :step="n"
                    >
                      <span class="title">Entrada:</span>
                      <v-row align="start">
                        <v-col v-for="(teste, i) in exercicio.testes[n - 1].input" :key="i" md="2">
                          <v-text-field :value="teste" outlined readonly></v-text-field>
                        </v-col>
                      </v-row>
                      <span class="title">Saida:</span>
                      <v-textarea rows="1" :value="exercicio.testes[n-1].output" outlined readonly></v-textarea>
                      <div v-if="exercicio.testes[n-1].isPrivate">
                        <v-icon small>lock</v-icon>
                        <span>Este teste é privado</span>
                      </div>
                    </v-stepper-content>
                  </v-stepper-items>
                </v-stepper>
              </div>
              <v-divider class="my-2" />
              <v-row>
                <v-col>
                  <v-form :ref="`form-${exercicio._id}`">
                    <v-file-input
                      accept=".m"
                      label="Enviar"
                      v-model="exercicio.file"
                      :rules="[regras.required]"
                    ></v-file-input>
                  </v-form>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div v-if="exercicio.resolucao">
                    <span class="font-weight-bold subtitle-1">Sua resolução:</span>
                    <a
                      :href="`${backendUri}/resolucao/${exercicio.resolucao._id}/download`"
                    >{{exercicio.resolucao.resolucaoFilename}}</a>
                    <span>, submetido em</span>
                    <span>{{converterData(exercicio.resolucao.dataSubmissao)}}</span>
                  </div>
                  <div v-else>
                    <span class="font-weight-bold subtitle-1">Você ainda não submeteu uma resolução.</span>
                  </div>
                </v-col>
              </v-row>
              <v-row class="align-center justify-end">
                <v-btn text class="mx-6">
                  <v-icon>help_outline</v-icon>
                  <span>Ajuda</span>
                </v-btn>
                <v-dialog max-width="600px" v-model="dialogConfirmacao" v-if="exercicio.resolucao">
                  <template v-slot:activator="{ on }">
                    <v-btn outlined color="green" v-on="on">
                      <span>Enviar</span>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>Cuidado</v-card-title>
                    <v-card-text>
                      <span class="subtitle-1 black--text">
                        A submissão dessa atividade irá sobrescrever a submissão anterior (
                        <b>{{exercicio.resolucao.resolucaoFilename}}</b>). Você tem certeza que deseja prosseguir ?
                      </span>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn text color="red" @click="dialogConfirmacao = false">Cancelar</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn outlined color="green" @click="upload(exercicio)">Enviar</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-btn outlined color="green" @click="upload(exercicio)" v-else>Enviar</v-btn>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <template v-if="exercicios.length == 0">
          <span
            class="subtitle-1 black--text"
          >Esta matéria ainda não possui nenhum exercício. Aguarde até que seu professor libere algum exercícios.</span>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import dataMixin from "../../../util/date";
import backend from "../../../backend";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  mixins: [dataMixin],
  data() {
    return {
      backendUri: backend.uri,
      dialogConfirmacao: false,
      materia: {
        nome: "",
        professor: ""
      },
      exercicios: [{}],
      carregando: true,
      regras: {
        required: value => !!value || "Obrigatório."
      },
      ev: null,
      testeAtivo: ""
    };
  },
  methods: {
    upload(exercicio) {
      if (this.$refs[`form-${exercicio._id}`][0].validate()) {
        let formData = new FormData();
        formData.append("arquivoResolucao", exercicio.file);
        formData.append("exercicioId", exercicio._id);
        axios
          .post(`${backend.uri}/resolucao/submit`, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            this.$store.commit("core/showMessage", {
              content: "Submissão enviada com sucesso",
              error: false
            });
            /* eslint-disable no-console */
            console.log(res);
            /* eslint-enable no-console */
          })
          .catch(e => {
            this.$store.commit("core/showMessage", {
              content: "Falha ao enviar submissão. Por favor, tente novamente mais tarde.",
              error: true,
            });
            /* eslint-disable no-console */
            console.log(e.response);
            /* eslint-enable no-console */
          });
      } else this.dialogConfirmacao = false;
    },
    onExpansionChange(exercicio) {
      this.buscarResolucao(exercicio);
      this.buscaTestesExercicio(exercicio);
    },
    buscaTestesExercicio(exercicio) {
      if (!exercicio.testeBuscado) {
        axios
          .get(`${backend.uri}/exercicio/${exercicio._id}/testes`)
          .then(res => {
            exercicio.testes = res.data.data.testes;
            exercicio.testeBuscado = true;
            this.$forceUpdate();
          });
      }
    },
    buscarResolucao(exercicio) {
      if (!exercicio.resolucaoBuscada)
        axios.get(`${backend.uri}/resolucao/${exercicio._id}`).then(res => {
          exercicio.resolucao = res.data.data.resolucao;
          exercicio.resolucaoBuscada = true;
          this.$forceUpdate();
        });
    }
  },
  created() {
    axios
      .get(`${backend.uri}/materia/${this.$route.params.id}/show`)
      .then(res => {
        this.materia = res.data.data;
        this.carregando = false;
      });
    axios
      .get(`${backend.uri}/exercicio/show/${this.$route.params.id}`)
      .then(res => {
        this.exercicios = res.data.data.exercicios;
      });
  }
};
</script>
<style>
.atrazado .v-expansion-panel-header,
.atrazado .v-expansion-panel-content {
  border-left: 4px solid tomato;
}
.adiantado .v-expansion-panel-header,
.adiantado .v-expansion-panel-content {
  border-left: 4px solid #3cd1c2;
}
</style>



