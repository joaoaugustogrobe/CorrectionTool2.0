<template>
  <div>
    <v-container v-if="matriculas && matriculas.length">
      <v-row>
        <v-col>
          <span class="title">Minhas matérias</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(matricula, i) in matriculas" :key="i" lg="6" cols="12">
          <v-card
            flat
            class="mb-1 px-3"
            :loading="matricula.carregando"
            router
            :to="`/aluno/materia/${matricula.materia._id}`"
          >
            <v-row class="py-1">
              <v-col sm="6" cols="12">
                <div class="caption grey--text">Nome da matéria</div>
                <div class="subtitle-1 black--text">
                  {{ matricula.materia.nome }}
                </div>
              </v-col>
              <v-col sm="4" cols="8">
                <div class="caption grey--text">Professor</div>
                <div class="subtitle-1 black--text">
                  {{ matricula.materia.professor.nome }}
                </div>
              </v-col>
              <v-col sm="2" cols="4">
                <div class="caption grey--text">Exercicios</div>
                <div class="subtitle-1 black--text">
                  {{ matricula.exercicios }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="pages"
              v-if="pages > 1"
              @input="paginacao"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
      <!-- show empty message with icon -->
      <v-container v-else>
        <v-row>
          <v-col>
            <v-card flat class="mb-1">
              <v-card-text>
                <span class="headline">
                  Você não está matriculado em nenhuma matéria
                </span>
              </v-card-text>
              <!-- button to go to /matriculas -->
              <v-card-actions>
                <v-btn
                  color="primary"
                  dark
                  class="white--text"
                  @click="$router.push('/aluno/matricula')"
                >
                  Matricular-se
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import backend from "../../../backend";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      page: 1,
      pages: 1,
      matriculas: [],
    };
  },
  created() {
    axios.get(`${backend.uri}/matricula`).then((res) => {
      this.matriculas = res.data.data;
      let metadata = res.data.meta;
      this.pages = Math.ceil(metadata?.matriculas / metadata?.itensPagina);
    });
  },
  methods: {
    paginacao(pagina) {
      axios.get(`${backend.uri}/matricula?page=${pagina}`).then((res) => {
        this.matriculas = res.data.data;
      });
    },
  },
};
</script>

<style>
</style>