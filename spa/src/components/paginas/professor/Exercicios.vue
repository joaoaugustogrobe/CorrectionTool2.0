<template>
  <div class="exercicios">
    <v-subheader class="grey--text">EXERCÍCIOS</v-subheader>
    <!-- <adicionar-exercicio :adicionarCallback="adicionarExercicio"/> -->

    <v-container class="my-5">
      <v-layout row class="mb-3">
        <v-btn small text color="grey" @click="ordenar('descricao')">
          <v-icon>home_work</v-icon>
          <span class="caption">Ordenar por exercicio</span>
        </v-btn>
        <v-btn small text color="grey" @click="ordenar('materia')">
          <v-icon>school</v-icon>
          <span class="caption">Ordenar por matéria</span>
        </v-btn>
        <v-btn small text color="grey" @click="ordenar('status')">
          <v-icon>check_box</v-icon>
          <span class="caption">Ordenar por status</span>
        </v-btn>
        <v-btn small text color="grey" @click="ordenar('data')">
          <v-icon>calendar_today</v-icon>
          <span class="caption">Ordenar por data de final</span>
        </v-btn>
      </v-layout>

      <card-exercicio
        flat
        class="px-2 my-3"
        v-for="(exercicio, i) in exercicios"
        :key="i"
        :loading="carregando"
        :exercicioNome="exercicio.titulo"
        :materiaNome="exercicio.materia.nome"
        :submissoes="exercicio.submissoesCount"
        :dataFinal="exercicio.prazo"
        :status="exercicio.status"
        :id="exercicio._id"
      >
      {{exercicio}}
      </card-exercicio>
    </v-container>

    <v-btn class="amber accent-3" fixed bottom right fab @click="onNovoExercicio">
      <v-icon>add</v-icon>
    </v-btn>
    <AdicionarExercicio />
  </div>
</template>


<script>
import CardExercicio from "../../template/CardExercicio";
// import AdicionarExercicio from "../../template/AdicionarExercicio";
import AdicionarExercicio from "../../modals/WizardCadastroExercicio.vue";
import backend from '../../../backend'
import axios from 'axios'
axios.defaults.withCredentials = true;


export default {
  data() {
    return {
      carregando: true,
      exercicios: [
        {
          descricao: "",
          materia: {nome:""},
          submissoes: "",
          prazo: "",
          status: ""
        }
      ],
      metodoOrdenacao: {
        materia: exercicios => exercicios.sort((a, b) => (a.materia.nome < b.materia.nome ? -1 : 1)),
        descricao: exercicios => exercicios.sort((a, b) => (a.descricao < b.descricao ? -1 : 1)),
        status: exercicios => exercicios.sort((a, b) => (a.status < b.status ? -1 : 1)),
        data: exercicios => exercicios.sort((a, b) => (a.prazo < b.prazo ? -1 : 1)),
      }
    };
  },
  methods: {
    ordenar(campo){
      this.metodoOrdenacao[campo](this.exercicios);
    },
    adicionarExercicio(exercicio){
      this.exercicios.unshift(exercicio)
    },
    onNovoExercicio(){
      this.$modal.show('cadastro-exercicio');
    }
  },
  components: {
    "card-exercicio": CardExercicio,
    AdicionarExercicio,
  },
  created(){
    console.log('fetch exercicios')
    axios.get(`${backend.uri}/exercicios`).then(res => {
      this.exercicios = res.data.data.exercicios
      this.carregando = false
    })

    this.$store.dispatch('professor/obterExercicios');
  }
};
</script>

<style>
</style>