<template>
  <div>
    <!-- <v-subheader class="grey--text">CORREÇAO</v-subheader> -->
    <v-container class="my-2">
      <h1>{{ exercicio.titulo }}</h1>
      <Resolucao
        :submissao="submissao"
        :key="submissao._id"
        v-if="submissao && submissao._id"
        @proximo="proximaSubmissao"
        @anterior="submissaoAnterior"
        :proximoExiste="proximoExiste"
        :anteriorExiste="anteriorExiste"
      />
    </v-container>
  </div>
</template>

<script>
import Resolucao from "../../template/ResolucaoItem.vue";

export default {
  components: {
    Resolucao,
  },
  mounted() {
    const {index} = this.$router.history.current.query;
    if(index){
      this.submissaoIndex = parseInt(index);
    }

    this.$store.dispatch("professor/obterSubmissoes", {
      exercicioId: this.exercicioId,
    });
    this.$store.dispatch("professor/obterExercicios");
  },
  data() {
    return {
      submissaoIndex: 0,
    };
  },
  methods: {
    proximaSubmissao() {
      if (this.proximoExiste) this.submissaoIndex++;
      else this.submissaoIndex = 0;
    },
    submissaoAnterior() {
      if (this.anteriorExiste) this.submissaoIndex--;
      else this.submissaoIndex = this.submissao.length;
    },
  },
  computed: {
    exercicioId() {
      return this.$route.params.id;
    },
    submissoes() {
      return this.$store.getters["professor/obterSubmissoesExercicio"](
        this.exercicioId
      );
    },
    submissao() {
      return this.submissoes[this.submissaoIndex];
    },
    exercicio() {
      return this.$store.getters["professor/obterExercicio"](this.exercicioId);
    },
    proximoExiste() {
      return this.submissoes[this.submissaoIndex + 1] != undefined;
    },
    anteriorExiste() {
      return this.submissaoIndex !== 0;
    },
  },
};
</script>
<style>
</style>