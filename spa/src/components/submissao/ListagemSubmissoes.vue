<template>
  <v-data-table :headers="headers" :items="_submissoes" class="elevation-1" @click:row="abrirCorrecao">
    <template v-slot:item.nota="{ item }">
      <span v-if="!item.nota && item.resolucaoFilename"
        >Aguardando avaliação</span
      >
      <span v-else-if="!item.nota">-</span>
      <span v-else-if="item.nota >= mediaNota"> {{ item.nota }}% </span>
      <div v-else>
        <span> {{ item.nota }}% </span>
        <v-badge color="red" inline dot />
      </div>
    </template>
    <template v-slot:item.status="{ item }">
      <v-icon v-if="item.status === 'pendente'"> mdi-clock </v-icon>
      <v-icon v-else-if="item.status === 'atrazado'" color="orange">
        mds-times
      </v-icon>
      <v-icon v-else-if="item.status === 'ok'" color="green">
        mdi-check-circle
      </v-icon>
      <!-- <v-badge v-else-if="item.status === 'nao-entregue'" color="red" /> -->
    </template>
    <template v-slot:item.dataSubmissao="{ item }">
      <span v-if="item.dataSubmissao">
        {{ dayjs(dayjs(new Date(parseInt(item.dataSubmissao)))).fromNow() }}
      </span>
      <span v-else> - </span>
    </template>
  </v-data-table>
</template>
<script>
const dayjs = require("dayjs");
dayjs.locale("pt-br");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  props: {
    submissoes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dayjs,
    };
  },
  computed: {
    _submissoes() {
      return this.submissoes.map((s, i) => {
        return { ...s, _index: i };
      });
    },
    exercicioId() {
      return this.$route.params.id;
    },
    client() {
      return this.$store.state.comum.client;
    },
    clientUrl() {
      return this.client.fullUrl;
    },
    mediaNota() {
      return 60;
    },
    headers() {
      return [
        {
          text: "",
          align: "center",
          sortable: true,
          value: "status",
          width: "45px",
        },
        {
          text: "Aluno",
          align: "start",
          sortable: true,
          value: "aluno.nome",
        },
        {
          text: "Desempenho",
          align: "start",
          sortable: true,
          value: "nota",
        },
        {
          text: "Tentativas",
          align: "center",
          sortable: true,
          value: "tentativas",
        },
        {
          text: "Comentarios",
          align: "center",
          sortable: true,
          value: "comentarios",
        },
        {
          text: "Submissão",
          align: "center",
          sortable: false,
          value: "resolucaoFilename",
        },
        {
          text: "Entrega",
          align: "center",
          sortable: true,
          value: "dataSubmissao",
        },
      ];
    },
  },
  methods: {
    abrirCorrecao(item){
      this.$router.push({path: `/correcao/${this.exercicioId}`, query: {index: item._index}});
    },
  },
};
</script>

<style>
</style>