<template>
  <div class="bloco-codigo-wrapper">
    <div class="submissao" :class="{ hover: !disabled }" v-if="disabled">
      <p
        v-for="(linha, i) in codigoLinhas"
        v-html="linha"
        :key="i"
        :data-comentario="comentarios[i] && comentarios[i].comentario"
      />
    </div>
    <div v-else class="submissao hover">
      <v-dialog v-model="dialog" width="600px">
        <template v-slot:activator="{ on, attrs }">
          <div class="submissao">
            <p
              v-for="(linha, i) in codigoLinhas"
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
                v-if="codigoLinhas[linhaIndex - 1]"
                v-html="codigoLinhas[linhaIndex - 1]"
              />
              <p
                v-html="codigoLinhas[linhaIndex]"
                class="highlight"
                :data-comentario="comentario"
              />
              <p
                v-if="codigoLinhas[linhaIndex + 1]"
                v-html="codigoLinhas[linhaIndex + 1]"
              />
            </div>

            <v-form @submit.prevent.stop>
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
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <v-btn text @click="salvarComentario">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <a class="download-link"
      v-if="download && submissao._id"
      :href="`${clientUrl}/resolucao/${submissao._id}/download`"
      target="_blank"
      >Download</a
    >
  </div>
</template>

<script>
import { butify } from "../util/beautifier";

export default {
  data() {
    return {
      butify,
      comentario: "",
      dialog: false,
      linhaIndex: null,
    };
  },
  props: {
    codigo: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    submissao: {
      type: Object,
      default: () => {},
    },
    comentarios: {
      type: Object,
      default: () => {
        return {};
      },
    },
    download: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    codigoLinhas() {
      let html = this.butify(this.codigo, {});
      let t = html.split(/<br \/>/gm);
      return t;
    },
    client() {
      return this.$store.state.comum.client;
    },
    clientUrl() {
      return this.client.fullUrl;
    },
  },
  methods: {
    comentarLinha(linha) {
      this.$modal.show("comentar-bloco-codigo", { codigo: this.codigo, linha });
    },
    async salvarComentario() {
      const req = await this.$store.dispatch("professor/salvarComentario", {
        resolucaoId: this.submissao._id,
        comentario: this.comentario,
        linha: this.linhaIndex,
      });

      if (req.ok) {
        this.dialog = false;
        this.comentario = "";
      }
    },
    async adicionarComentario(linhaIndex) {
      this.dialog = true;
      this.comentario =
        (this.comentarios[linhaIndex] &&
          this.comentarios[linhaIndex].comentario) ||
        "";
      this.linhaIndex = linhaIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
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

  height: auto;
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
      background-color: #f6f6f6;
      cursor: unset;
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

  &.hover p:hover {
    background-color: #efefef;
    cursor: pointer;
  }
}
.v-popover {
  .trigger {
    width: 100% !important;
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

.bloco-codigo-wrapper{
  position: relative;
  .download-link {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
    font-size: 13px;
  }
}
</style>