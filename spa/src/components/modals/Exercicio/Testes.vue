<template>
  <v-container>
    <v-row>
      <v-col>
        <v-stepper v-model="testeIndex">
          <v-stepper-header>
            <template v-for="(resolucao, index) in testes">
              <v-stepper-step :step="index" :key="index" editable>
                {{ resolucao.nome }}
              </v-stepper-step>
              <v-divider
                :key="`${index}-divider`"
                v-if="index !== testes.length - 1"
              ></v-divider>
            </template>

            <v-divider></v-divider>

            <v-stepper-step step="+" key="addStep" editable>
              Adicionar teste
            </v-stepper-step>

            <!-- <v-divider></v-divider> -->
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="(teste, index) in testes"
              :step="index"
              :key="index"
            >
              <div class="px-4 py-4">
                <v-form v-if="testeIndex !== -1" ref="form">
                  <v-row>
                    <v-col cols="12" class="mb-4">
                      <ConfiguracaoItem
                        v-model="formTeste.isPrivate"
                        label="Teste privado"
                        descricao="Testes privados exibirão inputs e outputs para alunos"
                        has-switch
                        :loading="loading"
                        @input="onSalvar"
                      />
                    </v-col>
                    <v-col cols="12">
                      <ConfiguracaoItem
                        v-model="formTeste.nome"
                        textfield
                        label="Titulo"
                        :rules="[rules.required, rules.min]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <ConfiguracaoItem
                        v-model="formTeste.mensagemErro"
                        textfield
                        label="Mensagem de erro"
                        descricao="Mensagem de erro exibida ao aluno caso o teste falhe"
                        :rules="[rules.required, rules.min]"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    v-for="(assinaturaArg, index) in exercicio.assinatura"
                    :key="index"
                  >
                    <v-col>
                      <ConfiguracaoItem :label="assinaturaArg">
                        <v-text-field
                          :value="formTeste.input[index]"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          :rules="[rules.required]"
                          @input="
                            (e) => onAtualizarInput(formTeste.input[index], e)
                          "
                          @click:append="() => onCopy(formTeste.input[index])"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <ConfiguracaoItem label="Output">
                        <v-text-field
                          v-model="formTeste.output"
                          :rules="[rules.required]"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          @click:append="() => onCopy(formTeste.output)"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-stepper-content>

            <v-stepper-content step="+">
              <div class="px-4 py-4">
                <v-form v-if="testeIndex !== -1" ref="formCriacao">
                  <v-row>
                    <v-col cols="12" class="mb-4">
                      <ConfiguracaoItem
                        v-model="formTeste.isPrivate"
                        label="Teste privado"
                        descricao="Testes privados exibirão inputs e outputs para alunos"
                        has-switch
                        :loading="loading"
                      />
                    </v-col>
                    <v-col cols="12">
                      <ConfiguracaoItem
                        v-model="formTeste.nome"
                        textfield
                        label="Titulo"
                        :rules="[rules.required, rules.min]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <ConfiguracaoItem
                        v-model="formTeste.mensagemErro"
                        textfield
                        label="Mensagem de erro"
                        descricao="Mensagem de erro exibida ao aluno caso o teste falhe"
                        :rules="[rules.required, rules.min]"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    v-for="(assinaturaArg, index) in exercicio.assinatura"
                    :key="index"
                  >
                    <v-col>
                      <ConfiguracaoItem
                        :label="`Input ${index + 1}`"
                        :descricao="assinaturaArg"
                      >
                        <v-text-field
                          :value="formTeste.input[index]"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          :rules="[rules.required]"
                          @input="(e) => onAtualizarInput(index, e)"
                          @click:append="() => onCopy(formTeste.input[index])"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <ConfiguracaoItem label="Output" descricao="y">
                        <v-text-field
                          v-model="formTeste.output"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          :rules="[rules.required]"
                          @click:append="() => onCopy(formTeste.output)"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-stepper-content>
          </v-stepper-items> </v-stepper
      ></v-col>
    </v-row>
    <div class="py-3 my-3 float-right" v-if="!isCriandoTeste">
      <v-btn
        v-if="testeAlterado && !loading"
        class="mx-2"
        color="primary"
        @click="onSalvar"
        >Salvar</v-btn
      >
      <v-btn v-if="!loading" class="mx-2" color="red" @click="onDeletar"
        >Deletar</v-btn
      >
      <v-btn
        v-if="testeAlterado && !loading"
        color="warning"
        outlined
        @click="onCancelar"
        >Cancelar</v-btn
      >
    </div>
    <div class="py-3 my-3 float-right" v-else>
      <v-btn v-if="!loading" class="mx-2" color="primary" @click="onCriar"
        >Criar</v-btn
      >
      <v-btn
        v-if="testeAlterado && !loading"
        color="warning"
        outlined
        @click="onCancelar"
        >Cancelar</v-btn
      >
    </div>
  </v-container>
</template>

<script>
import ConfiguracaoItem from "../../configuracao/Item.vue";
import inputMixin from "../../../util/inputs";

import _ from "lodash";
import { mapGetters } from "vuex";

export default {
  mixins: [inputMixin],
  components: {
    ConfiguracaoItem,
  },
  data() {
    return {
      testeIndex: 0,
      formTeste: {
        input: [],
        nome: "",
        isPrivate: false,
        mensagemErro: "",
        _id: "",
        output: "",
        exercicio: "",
      },
      novoInput: "",
    };
  },
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("professor", ["obterTestes"]),
    testes() {
      return this.obterTestes(this.exercicio._id);
    },
    loading() {
      return this.$store.state.loading["professor/salvarTeste"];
    },
    testeAlterado() {
      if (this.testeIndex === -1) return false;
      if (this.isCriandoTeste)
        return !_.isEqual(this.formVazio, this.formTeste);
      else return !_.isEqual(this.testes[this.testeIndex], this.formTeste);
    },
    formVazio() {
      return {
        input: [],
        nome: "",
        isPrivate: false,
        mensagemErro: "",
        _id: "",
        output: "",
        exercicio: "",
      };
    },
    isCriandoTeste() {
      return this.testeIndex === "+";
    },
  },
  methods: {
    onSalvar() {
      const formValido = this.$refs?.form[0]?.validate();
      if(formValido)
        this.$store.dispatch("professor/salvarTeste", this.formTeste);
    },
    onCancelar() {
      this.resetarForm();
    },
    onDeletar() {
      this.$store.dispatch("professor/deletarTeste", {
        testeId: this.formTeste._id,
        exercicioId: this.exercicio._id,
      });
      if (this.testes.length) this.testeIndex = 0;
      else this.testeIndex = "+";
    },
    resetarForm() {
      this.$nextTick(() => {
        if (this.$refs.form && this.$refs.form[0])
          this.$refs.form[0].resetValidation();
        if (this.$refs.formCriacao && this.$refs.formCriacao.resetValidation)
          this.$refs.formCriacao.resetValidation();
      });

      if (this.testeIndex === -1) return;
      if (!this.testes[this.testeIndex]) this.testeIndex = "+";
      if (this.isCriandoTeste) {
        this.formTeste = _.cloneDeep(this.formVazio);
        this.formTeste.input = new Array(
          this.exercicio.assinatura && this.exercicio.assinatura.length
        ).fill("");
      } else this.formTeste = _.cloneDeep(this.testes[this.testeIndex]);
    },
    onCopy(e) {
      navigator.clipboard.writeText(e);
      this.$store.commit("core/showMessage", {
        content: "Copiado para a área de transferencia!",
        error: false,
      });
    },
    async onCriar() {
      const formValido = this.$refs.formCriacao.validate();
      if (formValido) {
        await this.$store.dispatch("professor/criarTeste", {
          ...this.formTeste,
          exercicioId: this.exercicio._id,
        });
        this.testeIndex = this.testes.length - 1;
      }
    },
    onAdicionarNovoInput() {
      if (this.novoInput) {
        this.formTeste.input.push(this.novoInput);
        this.novoInput = "";
      }
    },
    onAtualizarInput(index, input) {
      this.formTeste.input.splice(index, 1, input);
    },
    validarForm() {
      if (this.$refs.form && this.$refs.form[0])
        return this.$refs.form[0].validate();
      return false;
    },
  },
  watch: {
    testeIndex: {
      immediate: true,
      handler() {
        this.resetarForm();
      },
    },
    testes: {
      deep: true,
      handler() {
        this.resetarForm();
      },
    },
  },
};
</script>

<style scoped>
.col {
  padding: 0 12px;
}
::v-deep .v-stepper__header {
  flex-wrap: nowrap;
  overflow-x: scroll;
}
::v-deep .v-stepper__step {
  flex-shrink: 0;
}
::v-deep .v-divider {
  min-width: 30px;
}
</style>