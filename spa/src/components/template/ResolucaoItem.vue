<template>
  <v-card class="mx-auto">
    <v-card-title>{{ submissao.aluno.nome }}</v-card-title>
    <v-card-subtitle>{{ submissao.resolucaoFilename }}</v-card-subtitle>
    <input type="hidden" name="text_field" id="text_field" value="" />
    <!-- <div v-html="resolucaoFormatado" class="submissao"></div> -->
    <v-dialog v-model="dialog" width="600px">
      <template v-slot:activator="{ on, attrs }">
        <div class="submissao">
          <p
            v-for="(linha, i) in resolucaoLinhas"
            v-html="linha"
            :key="i"
            v-on="on"
            v-bind="attrs"
            @click="adicionarComentario(i)"
            :data-comentario="comentarios[i] && comentarios[i].comentario"
          />
        </div>
      </template>
      <v-card>
        <v-card-title
          ><span>{{ submissao.resolucaoFilename }}</span></v-card-title
        >
        <v-card-subtitle>
          <span>{{ submissao.aluno.nome }}</span>
        </v-card-subtitle>
        <v-card-text>
          <div class="submissao">
            <p
              v-if="resolucaoLinhas[linhaIndex - 1]"
              v-html="resolucaoLinhas[linhaIndex - 1]"
            />
            <p
              v-html="resolucaoLinhas[linhaIndex]"
              class="highlight"
              :data-comentario="comentario"
            />
            <p
              v-if="resolucaoLinhas[linhaIndex + 1]"
              v-html="resolucaoLinhas[linhaIndex + 1]"
            />
          </div>

          <v-form v-model="comentarioValido" @submit="salvarComentario">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="comentario"
                    label="Comentario"
                    required
                    autofocus
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text>Cancel</v-btn>
          <v-btn text>Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <StepperResolucaoItem :submissao="submissao" />

    <div class="avaliacao px-3 mt-4">
      <div class="d-flex justify-space-between">
        <span>Resolução do aluno</span>
        <small>{{ resolucaoNota }}%</small>
      </div>
      <v-slider
        v-model="resolucaoNota"
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
</template>

<script>
import StepperResolucaoItem from "../comum/StepperResolucaoItem";

import { butify } from "../../util/beautifier";
import { mapGetters } from "vuex";

export default {
  props: {
    submissao: {
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
    StepperResolucaoItem,
  },
  data() {
    return {
      resolucaoFile: "",
      resolucaoNota: 0,
      dialog: false,
      linhaIndex: null,
      comentarioValido: true,
      comentario: "",
    };
  },
  mounted() {
    this.baixarResolucao();
    this.baixarFeedback();
    this.obterDadosExecucao();
  },
  computed: {
    ...mapGetters("core", ["user", "isProfessor", "isAluno"]),
    ...mapGetters("aluno", ["obterResolucao"]),
    ...mapGetters("comum", ["obterComentarios"]),
    comentarios() {
      return this.obterComentarios(this.submissao._id);
    },
    correcao() {
      return this.$store.getters["comum/correcao"](this.submissao._id);
    },
    resolucaoLinhas() {
      let html = this.butify(this.resolucaoFile, {});
      let t = html.split(/<br \/>/gm);
      // html = `<p>${t.join('</p><p>')}</p>`;
      // return html
      return t;
    },
    resolucaoTestes() {
      return this.$store.state.professor.resolucaoTeste[this.submissao._id];
    },
    nomeExercicio() {
      return "newton";
    },
    resolucaoNotaCor() {
      return this.resolucaoNota >= 60 ? "blue" : "red";
    },
    loading() {
      return (
        this.$store.state.loading["professor/downloadSubmissao"] ||
        this.$store.state.loading["comum/downloadFeedback"]
      );
    },
  },
  watch: {
    correcao: {
      deep: true,
      handler(correcao) {
        this.resolucaoNota = correcao.notaCorrecao;
      },
    },
  },
  methods: {
    async onResolucaoNotaAlterado(e) {
      await this.$store.dispatch("professor/salvarNota", {
        resolucaoId: this.submissao._id,
        nota: e,
      });
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
        "professor/downloadSubmissao",
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
      this.$store.dispatch("professor/obterDadosExecucao", this.submissao._id);
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