<template>
  <v-stepper v-model="testeIndex">
    <v-stepper-header>
      <template v-for="(resolucao, index) in resolucaoTestes">
        <v-stepper-step
          :step="index"
          :key="index"
          editable
          :rules="[() => !resolucao.testeresolucao.isError]"
        >
          {{ resolucao.nome }}
        </v-stepper-step>
        <v-divider
          :key="`${index}-divider`"
          v-if="index !== resolucaoTestes.length - 1"
        ></v-divider>
      </template>

      <v-divider></v-divider>

      <!-- <v-divider></v-divider> -->
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content
        v-for="(resolucao, index) in resolucaoTestes"
        :step="index"
        :key="index"
      >
        <v-card class="pb-12">
          <div class="px-4 py-4">
            <v-form>
              <v-row v-for="(input, index) in resolucao.input" :key="index">
                <v-col>
                  <v-text-field
                    :label="`Input ${index + 1}`"
                    :value="input"
                    readonly
                    outlined
                    append-icon="mdi-content-copy"
                    @click:append="onCopy"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea
                    label="Output do teste"
                    v-if="isProfessor"
                    :value="resolucao.output"
                    readonly
                    outlined
                    append-icon="mdi-content-copy"
                    @click:append="onCopy"
                  />
                </v-col> </v-row
              ><v-row>
                <v-col>
                  <v-textarea
                    label="Output do aluno"
                    :value="resolucao.testeresolucao.output"
                    readonly
                    outlined
                    append-icon="mdi-content-copy"
                    @click:append="onCopy"
                  />
                </v-col>
              </v-row>
              <v-row class="float-right">
                <v-col>
                  <a
                    @click="onMudarEstadoResolucao(resolucao)"
                    v-if="resolucao.testeresolucao.isError"
                    >Clique aqui se essa solução estiver correta</a
                  >
                  <a @click="onMudarEstadoResolucao(resolucao)" v-else
                    >Clique aqui se essa solução estiver incorreta</a
                  >
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { parseOutput } from "../../util/parser.js";
import ConfiguracaoItem from "../configuracao/Item.vue";
import {mapGetters} from 'vuex';

export default {
  components: {
    ConfiguracaoItem,
  },
  data() {
    return {
      testeIndex: -1,
    };
  },
  props: {
    submissao: {
      type: Object,
      default: () => {
        return {
          testeresolucao: { isError: false },
        };
      },
    },
  },
  computed: {
    ...mapGetters('core', ['user', 'isProfessor', 'isAluno']),
    resolucaoTestes() {
      return (
        this.$store.state.professor.resolucaoTeste[this.submissao._id] || []
      );
    },
    loading() {
      return false;
    },
  },
  methods: {
    onCopy() {},
    onSalvar() {},
    parseOutput,
    async onMudarEstadoResolucao(resolucao) {
      const req = await this.$store.dispatch('professor/atualizarTesteResolucao', {...resolucao.testeresolucao, isError: !resolucao.testeresolucao.isError});
      if(req.ok) this.testeIndex = -1;
    },
  },
};
</script>

<style>
</style>