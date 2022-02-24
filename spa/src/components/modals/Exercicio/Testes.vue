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

            <!-- <v-divider></v-divider> -->
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="(teste, index) in testes"
              :step="index"
              :key="index"
            >
              <div class="px-4 py-4">
                <v-form v-if="testeIndex !== -1">
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
                      />
                    </v-col>
                    <v-col cols="12">
                      <ConfiguracaoItem
                        v-model="formTeste.mensagemErro"
                        textfield
                        label="Mensagem de erro"
                        descricao="Mensagem de erro exibida ao aluno caso o teste falhe"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-for="(input, index) in formTeste.input" :key="index">
                    <v-col>
                      <ConfiguracaoItem :label="`Input ${index + 1}`">
                        <v-text-field
                          :value="input"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          append-outer-icon="mdi-delete"
                          @input="(e)=>onAtualizarInput(index, e)"
                          @click:append="() => onCopy(input)"
                          @click:append-outer="() => onRemoverInput(index)"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <ConfiguracaoItem
                        :label="`Input ${formTeste.input.length + 1}`"
                        descricao="Novo input"
                      >
                        <v-text-field
                          v-model="novoInput"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          append-outer-icon="mdi-plus"
                          @click:append="() => onCopy(novoInput)"
                          @click:append-outer="onAdicionarNovoInput"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                  {{ novoInput }}
                  <v-row>
                    <v-col>
                      <ConfiguracaoItem label="Output">
                        <v-text-field
                          v-model="formTeste.output"
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
          </v-stepper-items> </v-stepper
      ></v-col>
    </v-row>
    <div class="py-3 my-3 float-right">
      <v-btn
        v-if="testeAlterado && !loading"
        class="mx-2"
        color="primary"
        @click="onSalvar"
        >Salvar</v-btn
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

import _ from "lodash";
import { mapGetters } from "vuex";

export default {
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
      return !_.isEqual(this.testes[this.testeIndex], this.formTeste);
    },
  },
  methods: {
    onSalvar() {
      this.$store.dispatch("professor/salvarTeste", this.formTeste);
    },
    onCancelar() {
      this.resetarForm();
    },
    resetarForm() {
      if (this.testeIndex === -1) return;
      this.formTeste = _.cloneDeep(this.testes[this.testeIndex]);
    },
    onCopy(e) {
      navigator.clipboard.writeText(e);
      this.$store.commit("core/showMessage", {
        content: "Copiado para a área de transferencia!",
        error: false,
      });
    },
    onAdicionarNovoInput() {
      if (this.novoInput) {
        this.formTeste.input.push(this.novoInput);
        this.novoInput = "";
      }
    },
    onRemoverInput(index) {
      this.formTeste.input.splice(index, 1);
    },
    onAtualizarInput(index, input) {
      this.formTeste.input.splice(index, 1, input);
    }
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
      }
    }
  },
};
</script>

<style scoped>
.col {
  padding: 0 12px;
}
</style>