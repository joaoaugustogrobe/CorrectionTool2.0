<template>
  <v-row v-if="resolucao" class="pb-1">
    <v-col class="py-0">
      <v-alert
        dense
        type="info"
        color="grey darken-3"
        v-if="exercicio && resolucao && resolucao.status === 'pendente'"
      >
        <strong>{{ resolucao.resolucaoFilename }}</strong>
        adicionado a fila de execução.
      </v-alert>
      <v-alert
        dense
        type="success"
        close-icon="d-flex align-items-center"
        v-else-if="
          exercicio &&
          resolucao &&
          resolucao.status === 'ok'
        "
      >
        Correção para
        <strong>{{ resolucao.resolucaoFilename }}</strong>
        esta pronta.

        <v-btn
          name="append"
          class="float-right"
          outlined
          small
          @click="onVisualizarResolucao"
          >Visualizar</v-btn
        >
        <v-progress-circular
          v-if="buscandoResolucao"
          indeterminate
          color="gray"
          class="mr-4 mt-1 float-right"
          size="20"
        />
      </v-alert>
      <!-- <v-alert
        dense
        type="success"
        color="grey darken-3"
        @click="onVisualizarResolucao"
        v-else-if="
          exercicio &&
          resolucao &&
          resolucao.status === 'ok' &&
          !resolucao.corrigido
        "
      >
        Execução de
        <strong>{{ resolucao.resolucaoFilename }}</strong>
        foi realizada. Aguardando correção.
        <v-btn
          name="append"
          class="float-right"
          outlined
          small
          @click="onVisualizarResolucao"
          >Visualizar</v-btn
        >
      </v-alert> -->
    </v-col>
  </v-row>
</template>

<script>
import dataMixin from "../../../util/date";

export default {
  mixins: [dataMixin],
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
    resolucao: {
      type: Object,
      required: true,
    },
  },
  computed: {
    buscandoResolucao() {
      return this.$store.state.loading["aluno/obterResolucao"];
    }
  },
  methods: {
    onVisualizarResolucao(){
      this.$emit('visualizarResolucao');
    },
  },
};
</script>

<style>
</style>