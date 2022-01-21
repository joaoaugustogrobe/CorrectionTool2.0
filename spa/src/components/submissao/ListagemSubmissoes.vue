<template>
  <v-data-table :headers="headers" :items="submissoes" class="elevation-1">
    <template v-slot:item.nota="{ item }">
      <span v-if="!item.nota">Correção em progresso</span>
      <v-chip v-else>
        {{ item.calories }}
      </v-chip>
    </template>
    <template v-slot:item.status="{ item }">
      <v-icon v-if="item.status === 'pendente'"> mdi-clock </v-icon>
      <v-badge v-else-if="item.status === 'atrazado'" color="orange" />
      <v-badge v-else-if="item.status === 'ok'" color="green" />
      <v-badge v-else-if="item.status === 'nao-entregue'" color="red" />
    </template>
    <template v-slot:item.resolucaoFilename="{ item }">
      <a
        v-if="item.resolucaoFilename"
				:href="`${clientUrl}/resolucao/${item.resolucaoFilename}/download`"
				target="_blank"
      >{{item.resolucaoFilename}}</a>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: {
    submissoes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
		client(){
			return this.$store.state.comum.client;
		},
		clientUrl(){
			return this.client.fullUrl;
		},
    headers() {
      return [
        {
          text: "",
          align: "center",
          sortable: true,
          value: "status",
          width: "30px",
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
          text: "Submissão",
          align: "start",
          sortable: false,
          value: "resolucaoFilename",
        },
      ];
    },
  },
};
</script>

<style>
</style>