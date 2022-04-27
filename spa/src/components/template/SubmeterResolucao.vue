<template>
  <v-card>
    <v-card-title>
      <span v-if="submissao && submissao._id">Submeter nova resolução</span>
      <span v-else>Submeter resulução</span>
    </v-card-title>
    <v-card-subtitle>{{assinaturaFuncao}}</v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <v-form :ref="`form-${exercicio._id}`" v-model="formValido">
            <ConfiguracaoItem
              label="Comentários"
              descricao="Insira comentários para o professor"
            >
              <v-textarea
                v-model="form.comentarios"
                class="pt-2"
                outlined
                dense
              />
            </ConfiguracaoItem>
            <ConfiguracaoItem label="Submissão">
              <v-file-input
                :label="`${exercicio.nomeFuncao}.m`"
                v-model="form.file"
                class="pt-2"
                :rules="[rules.required, rules.fileSize]"
                outlined
                dense
              />
            </ConfiguracaoItem>
          </v-form>
        </v-col>
      </v-row>
      <v-row class="align-center justify-end" style="flex-grow: 0">
        <v-btn text class="mx-6">
          <v-icon>help_outline</v-icon>
          <span>Ajuda</span>
        </v-btn>
        <v-dialog
          max-width="600px"
          v-model="dialogConfirmacao"
          v-if="submissao._id"
        >
          <template v-slot:activator="{ on }">
            <v-btn outlined color="green" v-on="on" :disabled="!formValido">
              <span>Enviar</span>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Cuidado</v-card-title>
            <v-card-text>
              <span class="subtitle-1 black--text">
                A submissão dessa atividade irá sobrescrever a submissão
                anterior (
                <b>{{ submissao.resolucaoFilename }}</b
                >). Você tem certeza que deseja prosseguir ?
              </span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="red" @click="dialogConfirmacao = false"
                >Cancelar</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn outlined color="green" @click="onSubmeter">Enviar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn outlined color="green" @click="onSubmeter" v-else>Enviar</v-btn>
      </v-row></v-card-text
    >
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import inputsMixin from "/src/util/inputs";
import ConfiguracaoItem from "/src/components/configuracao/Item.vue";

export default {
  mixins: [inputsMixin],
  data() {
    return {
      dialogConfirmacao: false,
      form: {
        comentarios: "",
        file: null,
      },
      formValido: false,
    };
  },
  components: {
    ConfiguracaoItem,
  },
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
    submissao: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onSubmeter() {
      if (this.$refs[`form-${this.exercicio._id}`].validate()) {
        const req = await this.$store.dispatch("aluno/submeterResolucao", {
          arquivoResolucao: this.form.file,
          comentarios: this.form.comentarios,
          exercicioId: this.exercicio._id,
        });
        if(req.ok){
          this.dialogConfirmacao = false;
          this.$store.commit("core/showMessage", {
            content: "Resolução submetida com sucesso!",
            error: false,
          });
        }else{
          this.$store.commit("core/showMessage", {
            content: "Erro ao submeter resolução.",
            error: true,
          });
        }

      } else this.dialogConfirmacao = false;
    },
  },
  computed: {
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
};
</script>

<style>
</style>
