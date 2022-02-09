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
        <v-card class="mb-12 p-2" color="grey lighten-3">
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
            </v-form>
          </div>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { parseOutput } from "../../util/parser.js";
export default {
  data() {
    return {
      testeIndex: -1,
    };
  },
  props: {
    submissao: {
      type: Object,
      required: true,
    },
  },
  computed: {
    resolucaoTestes() {
      return this.$store.state.professor.resolucaoTeste[this.submissao._id];
    },
  },
  methods: {
    onCopy() {},
    parseOutput,
  },
};
</script>

<style>
</style>