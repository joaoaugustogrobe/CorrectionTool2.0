<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="alunos"
      class="elevation-1"
      :loading="loading"
    >
      <template v-slot:item.acoes="{ item }">
        <v-icon small class="mr-2" @click="expulsarAluno(item)">
          mdi-logout
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    materia: {
      type: Object,
      required: true,
    },
  },
  computed: {
		...mapGetters('professor', ['obterAlunos']),
    alunos() {
      return this.obterAlunos(this.materia._id);
    },
    loading() {
      return (
        this.$store.state.loading["professor/obterAlunosMateria"] ||
        this.$store.state.loading["professor/expulsarAluno"]
      );
    },
    headers() {
      return [
        { text: "Nome", value: "nome", sortable: false },
        { text: "Email", value: "email", sortable: false },
        { text: "Ações", value: "acoes", sortable: false },
      ];
    },
  },
  methods: {
    expulsarAluno(aluno) {
      this.$store.dispatch("professor/expulsarAluno", {
        aluno,
        materia: this.materia,
      });
    },
  },
	mounted() {
		this.$store.dispatch("professor/obterAlunosMateria", this.materia._id);
	}
};
</script>

<style>
</style>