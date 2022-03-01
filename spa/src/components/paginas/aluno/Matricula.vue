<template>
  <v-container>
    <span class="title">Matérias abertas</span>
    <v-card
      flat
      v-for="(materia, i) in materias"
      :key="i"
      class="my-3"
      :loading="materia.carregando"
    >
      <v-card-text>
        <v-row class="py-0">
          <v-col class="py-0" md="4" sm="6" cols="12">
            <div class="caption grey--text">Nome da Matéria</div>
            <div class="subtitle-1 black--text">{{materia.nome}}</div>
          </v-col>
          <v-col class="py-0" md="3" sm="6" cols="12">
            <div class="caption grey--text">Professor</div>
            <div class="subtitle-1 black--text">{{materia.professor.nome}}</div>
          </v-col>
          <v-col class="py-0" md="2" sm="12" cols="4">
            <div class="caption grey--text">Capacidade</div>
            <div class="subtitle-1 black--text">{{materia.lotacao}}/{{materia.capacidade}}</div>
          </v-col>
          <v-col class="py-0" md="3" sm="12" cols="12">
            <AdicionarMatricula
              v-if="materia.matriculado != true"
              :materia="materia"
              :successCallback="realizarMatriculaUI"
            />
            <v-btn v-else disabled block>
              <span>Matriculado</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import AdicionarMatricula from "../../template/AdicionarMatricula";
import backend from "../../../backend";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      materias: [
        { nome: "", lotacao: 0, capacidade: 0, professor: "", carregando: true }
      ]
    };
  },
  created() {
    axios.get(`${backend.uri}/materia`).then(res => {
      this.materias = res.data.data;
    });
  },
  components: {
    AdicionarMatricula
  },
  methods: {
    realizarMatriculaUI(materia) {
      materia.matriculado = true;
      this.$forceUpdate();
    }
  }
};
</script>

<style>
</style>