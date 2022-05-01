<template>
  <div>
    <StatusResolucaoAlert
      v-if="isAluno"
      :exercicio="exercicio"
      :resolucao="resolucao"
      @visualizarResolucao="onVisualizarSubmissao"
    />
    <v-card class="mx-auto" v-if="resolucao && resolucao._id && !loading">
      <v-card-title>
        <v-row>
          <v-col cols="10">{{ resolucao.aluno.nome }}</v-col>
          <v-col v-if="resolucao.status == 'ok'" cols="2">
            <v-chip :color="resolucaoNotaTipo"
              >{{ resolucao.nota }}%</v-chip
            ></v-col
          >
        </v-row>
      </v-card-title>
      <v-card-subtitle>{{ resolucao.resolucaoFilename }}</v-card-subtitle>
      <v-card-text>
        <div v-if="resolucao.comentarios">
          <h3>Comentários do aluno:</h3>
          <span>{{ resolucao.comentarios }}</span>
        </div>
      </v-card-text>
      <input type="hidden" name="text_field" id="text_field" value="" />
      <BlocoDeCodigo
        :codigo="resolucaoFile"
        :disabled="isAluno"
        :submissao="resolucao"
        :comentarios="comentarios"
        download
      />
    </v-card>
    <v-card class="mt-5" v-if="resolucao && resolucao._id && !loading">
      <v-card-title>Testes</v-card-title>
      <v-data-table
        :headers="testeHeaders"
        :items="resolucaoTestes"
        :expanded.sync="testeExpandidos"
        item-key="_id"
        show-expand
        :items-per-page="-1"
        :hide-default-footer="true"
      >
        <template v-slot:item.isPrivate="{ item }">
          <v-icon small v-if="item.isPrivate">lock</v-icon>
        </template>
        <template v-slot:item.testeresolucao.isError="{ item }">
          <v-icon small v-if="item.testeresolucao.isError" color="red"
            >mdi-alert-circle</v-icon
          >
        </template>
        <template v-slot:item.input="{ item }">
          <span v-for="(input, index) in item.input" :key="index">{{
            input.trim().slice(0, 10)
          }}</span>
        </template>

        <template v-slot:item.outoput="{ item }">
          {{ item.output.trim().slice(0, 10) }}
        </template>
        <template v-slot:item.testeresolucao.output="{ item }">
          {{ item.testeresolucao.output.trim().slice(0, 25) }}
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pt-2">
            <v-col cols="12">
              <div v-if="item.isPrivate" class="mb-4">
                <span class="d-flex justify-content-center">
                  <v-icon class="mr-1">lock</v-icon>Este teste é privado,
                  informações de input serão restritas.</span
                >
              </div>
              <h4>{{ item.nome }}</h4>
              <h5 v-if="item.testeresolucao.isError">
                {{ item.mensagemErro }}
              </h5>
              <BlocoDeCodigo
                :codigo="assinaturaTeste(item)"
                disabled
                class="my-4"
              />

              <ConfiguracaoItem
                v-if="isProfessor"
                :key="testeExpandidos.length"
                v-model="item.testeresolucao.isError"
                class="mb-4"
                label="Teste falhou"
                descricao="O teste é considerado como falho quando a resposta do aluno é diferente da resposta do professor."
                @input="() => alterarEstadoTeste(item)"
              >
                <v-btn
                  outlined
                  small
                  class="float-right"
                  v-if="item.testeresolucao.isError"
                  @click="() => mudarEstadoTeste(item)"
                  >Mudar para ACERTO</v-btn
                >
                <v-btn
                  outlined
                  small
                  class="float-right"
                  v-else
                  @click="() => mudarEstadoTeste(item)"
                  >Mudar para ERRO</v-btn
                >
              </ConfiguracaoItem>

              <template v-if="!item.isPrivate || isProfessor">
                <!-- <ConfiguracaoItem
                  v-for="(input, index) in item.input"
                  :key="index"
                  :value="input"
                  textfield
                  readonly
                  :label="`Argumento: ${exercicio.assinatura[index]}`"
                /> -->
                <ConfiguracaoItem
                  :value="item.output"
                  textfield
                  readonly
                  label="Output"
                />
              </template>
              <ConfiguracaoItem
                :value="item.testeresolucao.output"
                textfield
                readonly
                label="Output do aluno"
              />
            </v-col>
          </td>
        </template>
      </v-data-table>
    </v-card>

    <v-card class="mt-5" v-if="submissao && submissao._id && isProfessor">
      <v-card-title>Avaliação</v-card-title>
      <div class="avaliacao px-3 mt-4">
        <div class="d-flex justify-space-between">
          <span>Resolução do aluno</span>
          <small>{{ submissao.nota }}%</small>
        </div>
        <v-slider
          v-model="submissao.nota"
          :thumb-color="resolucaoNotaCor"
          thumb-label
          :disabled="isAluno"
          @change="onResolucaoNotaAlterado"
        >
        </v-slider>
      </div>

      <v-card-actions v-if="isProfessor">
        <v-btn :disabled="!anteriorExiste" @click="$emit('anterior')"
          >Anterior</v-btn
        >
        <v-btn :disabled="!proximoExiste" @click="$emit('proximo')"
          >Proximo</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import ConfiguracaoItem from "../configuracao/Item.vue";
import BlocoDeCodigo from "../BlocoDeCodigo.vue";
import StatusResolucaoAlert from "../modals/Exercicio/StatusResolucaoAlert.vue";

import { butify } from "../../util/beautifier";
import { mapGetters } from "vuex";

export default {
  props: {
    submissao: {
      type: Object,
      required: true,
    },
    exercicio: {
      type: Object,
      required: true,
    },
    proximoExiste: {
      type: Boolean,
      default: false,
    },
    anteriorExiste: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConfiguracaoItem,
    BlocoDeCodigo,
    StatusResolucaoAlert,
  },
  data() {
    return {
      resolucaoFile: "",
      dialog: false,
      linhaIndex: null,
      comentarioValido: true,
      comentario: "",
      testeExpandidos: [],
      dialogConfirmacao: false,
      form: {
        comentarios: "",
        file: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters("core", ["user", "isProfessor", "isAluno"]),
    ...mapGetters("aluno", ["obterResolucao"]),
    ...mapGetters("comum", ["obterComentarios", "obterResolucaoTeste"]),
    comentarios() {
      return this.obterComentarios(this.submissao._id);
    },
    resolucao() {
      return this.submissao;
    },
    resolucaoLinhas() {
      let html = this.butify(this.resolucaoFile, {});
      let t = html.split(/<br \/>/gm);
      // html = `<p>${t.join('</p><p>')}</p>`;
      // return html
      return t;
    },
    resolucaoTestes() {
      return this.obterResolucaoTeste(this.resolucao._id);
    },
    nomeExercicio() {
      return "newton";
    },
    resolucaoNotaCor() {
      return this.resolucao.nota >= 60 ? "green" : "red";
    },
    resolucaoNotaTipo() {
      return this.resolucao.nota >= 60 ? "success" : "warning";
    },
    loading() {
      return (
        this.$store.state.loading["comum/downloadSubmissao"] ||
        this.$store.state.loading["comum/downloadFeedback"] ||
        this.$store.state.loading["aluno/submeterResolucao"]
      );
    },
    testeHeaders() {
      return [
        {
          value: "isPrivate",
          sortable: true,
          width: "8px",
        },
        {
          value: "testeresolucao.isError",
          sortable: true,
          width: "8px",
        },
        {
          text: "Teste",
          value: "nome",
          sortable: true,
        },
        {
          text: "Input",
          value: "input",
        },
        {
          text: "Output",
          value: "output",
        },
        {
          text: "Output aluno",
          value: "testeresolucao.output",
        },
      ];
    },
  },
  watch: {
    resolucao: {
      deep: true,
      handler(resolucao, oldresolucao) {
        if (resolucao.tentativas !== oldresolucao.tentativas) {
          this.init();
        }
      },
    },
    submeterResolucao(submetendo) {
      if (submetendo) {
        this.resolucaoFile = "";
      }
    },
  },
  methods: {
    async init() {
      await this.baixarResolucao();
      if (this.resolucaoFile) {
        this.baixarFeedback();
        this.obterDadosExecucao();
      }
    },
    onVisualizarSubmissao() {
      this.$modal.show("feedback-resolucao-aluno", {
        exercicio: this.exercicio,
      });
    },
    async mudarEstadoTeste(teste) {
      await this.$store.dispatch("professor/atualizarTesteResolucao", {
        id: teste.testeresolucao._id,
        isError: !teste.testeresolucao.isError,
      });
      this.obterDadosExecucao();
      this.obterSubmissao();
    },
    obterSubmissao(){
      this.$store.dispatch("aluno/obterResolucao", this.exercicio._id);
    },
    async onResolucaoNotaAlterado(e) {
      await this.$store.dispatch("professor/salvarNota", {
        resolucaoId: this.submissao._id,
        nota: e,
      });
    },
    assinaturaTeste(teste) {
      const parametros = teste.input.reduce((anterior, input) => {
        return anterior ? `${anterior}, ${input}` : input;
      }, "");

      return `${teste.isPrivate ? "% Informações de input restritas.\n" : ""}${
        this.exercicio.nomeFuncao
      }(${parametros})`;
    },
    async salvarComentario() {
      const req = await this.$store.dispatch("professor/salvarComentario", {
        resolucaoId: this.submissao._id,
        comentario: this.comentario,
        linha: this.linhaIndex,
      });
      if (req.ok) this.dialog = false;
    },
    async adicionarComentario(linhaIndex) {
      this.dialog = true;
      this.comentario =
        (this.comentarios[linhaIndex] &&
          this.comentarios[linhaIndex].comentario) ||
        "";
      this.linhaIndex = linhaIndex;
    },
    async baixarResolucao() {
      const req = await this.$store.dispatch(
        "comum/downloadSubmissao",
        this.submissao._id
      );
      if (req.ok) {
        this.resolucaoFile = req.data;
      } else {
        this.resolucaoFile = "";
      }
    },
    async baixarFeedback() {
      await this.$store.dispatch("comum/downloadFeedback", this.submissao._id);
    },
    obterDadosExecucao() {
      this.$store.dispatch("comum/obterDadosExecucao", this.submissao._id);
    },
    random(min, max) {
      return (Math.random() * (max - min + 1) + min).toFixed(2);
    },
    chamadaFuncao(funcao, testes) {
      return `${funcao}(${testes.join(" , ")})`;
    },
    butify,
  },
};
</script>
<style lang="scss">
.submissao {
  comm {
    color: #070;
  }
  func {
    color: #24b;
    font-weight: bold;
  }
  num {
    color: #d33;
  }
  end {
    color: #24b;
    font-weight: bold;
  }
  str {
    color: #83c;
  }
  err {
    background-color: #fcc;
  }

  height: 60vh;
  overflow-y: scroll;
  padding: 1rem 0;
  background-color: #f6f6f6;
  p {
    margin-bottom: 0;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &:hover {
      background-color: #efefef;
      cursor: pointer;
    }

    &:after {
      content: attr(data-comentario);
      font-size: 11px;
      line-height: 12px;
      width: 100%;
      text-align: end;
      padding-left: 6px;
      color: #070;
    }
  }
}
.v-card__text .submissao {
  height: unset;
  p:hover {
    background-color: #f6f6f6;
    cursor: unset;
  }
  p.highlight {
    background-color: #efefef;
  }
}
</style>