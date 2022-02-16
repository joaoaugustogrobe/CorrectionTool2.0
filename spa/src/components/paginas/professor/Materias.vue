<template>
  <div class="materias">
    <v-subheader class="grey--text">MATERIAS</v-subheader>
    <v-container class="my-5">
      <adicionar-materia :addMateriaCallback="adicionarMateriaViaProp" />

      <v-row align-content="space-around">
        <v-col
          md="6"
          sm="12"
          class="px-2 py-1"
          v-for="(materia, i) in materias"
          :key="i"
          @click="expandirMateria(materia)"
        >
          <v-card
            flat
            :loading="materia.carregando"
            :class="`${materia.status} materia px-2 my-1`"
          >
            <v-layout wrap class="pa-3">
              <v-flex xs="12" md="6" md6>
                <div class="caption grey--text">Nome do matéria</div>
                <div>{{ materia.nome }}</div>
              </v-flex>
              <v-flex xs="6" md="1">
                <div class="caption grey--text">Capacidade</div>
                <div>{{ materia.lotacao }} / {{ materia.capacidade }}</div>
              </v-flex>
              <v-flex xs="2" sm="4" md="1">
                <div class="caption grey--text">Status</div>
                <v-switch
                  class="my-0"
                  v-model="materia.status"
                  disabled
                  color="green"
                ></v-switch>
              </v-flex>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import dataMixin from "../../../util/date";
import CardExercicio from "../../template/CardExercicio";
import AdicionarMateria from "../../template/AdicionarMateria";
import backend from "../../../backend";
import axios from "axios";
axios.defaults.withCredentials = true;

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      carregando: false,
    };
  },
  components: {
    "card-exercicio": CardExercicio,
    "adicionar-materia": AdicionarMateria,
  },
  mixins: [dataMixin],
  methods: {
    buscarExerciciosMateria(materia) {
      if (materia.dadosPreenchidos == true) return;

      materia.dadosPreenchidos = true;
      materia.carregando = true;
      axios.get(`${backend.uri}/exercicio/show/${materia._id}`).then((res) => {
        materia.carregando = false;
        let exercicios = res.data.data.exercicios;
        let aux = materia.nome;
        materia.nome = "";
        materia.nome = aux; //Vue nota a mudança e é forçado a renderizar novamente
        materia.exercicios = exercicios; //Apenas adicionar um atributo ao objeto não esta forçando a renderização
      });
      axios.get(`${backend.uri}/${materia._id}/alunos`).then((res) => {
        materia.alunos = res.data.data.alunos;
      });
    },
    adicionarMateriaViaProp(materia) {
      this.materias.unshift(materia);
    },
    expandirMateria(materia) {
      this.$modal.show("materia-modal", { materia });
    },
  },
  computed: {
    ...mapGetters("professor", ["obterMaterias"]),
    materias() {
      return this.obterMaterias;
    },
  },
  created() {
    this.$store.dispatch("professor/obterMaterias");
    // axios.get(`${backend.uri}/materia`).then((res) => {
    //   this.carregando = false;
    //   let materias = res.data.data;

    //   materias.forEach((materia) => {
    //     materia.exercicio = [];
    //     materia.alunos = [];
    //     materia.carregando = false;
    //     materia.dadosPreenchidos = false;
    //   });
    //   this.materias = materias;
    // });
  },
};
</script>

<style>
.materia.true {
  border-left: 4px solid #3cd1c2;
}
.materia.false {
  border-left: 4px solid tomato;
}
.v-expansion-panel.carregando {
  background-color: #0f0f0f;
}
</style>