<template>
  <v-container class="my-5">
    <v-flex>
      <h2 class="pb-2">
        Exercícios de <b>{{ materia.nome }}</b>
      </h2>
      <div class="exercicios">
        <v-card
          v-for="exercicio in exercicios"
          :key="exercicio._id"
          class="mb-3 cursor-pointer"
          @click="onVisualizarExercicio(exercicio)"
        >
          <v-card-title>{{ exercicio.titulo }}</v-card-title>
          <v-card-subtitle
            ><v-badge
              inline
              color="red"
              dot
              v-if="minutosAPartirDeHoje(exercicio.prazo) > 0"
            />{{ displayData(exercicio.prazo) }} ·
            {{ dataRelativa(exercicio.prazo) }}</v-card-subtitle
          >
          <v-card-text>
            <div class="exercicio-descricao"> {{ exercicio.descricao }}</div>
          </v-card-text>
        </v-card>
      </div>
    </v-flex>
    <VisualizarExercicio />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import dataMixin from "../../../util/date";
import VisualizarExercicio from "../../modals/VisualizacaoExercicio/Exercicio.vue";



export default {
  mixins: [dataMixin],
  components: {
    VisualizarExercicio,
  },
  computed: {
    ...mapGetters("comum", ["obterMateria"]),
    ...mapGetters("aluno", ["obterExerciciosMateria"]),
    materia() {
      const materiaId = this.$route.params.id;
      return this.obterMateria(materiaId) || {};
    },
    exercicios() {
      const materiaId = this.$route.params.id;
      return this.obterExerciciosMateria(materiaId);
    },
  },
  methods: {
    onVisualizarExercicio(exercicio) {
      this.$modal.show("visualizar-exercicio", { exercicio });
    },
  },
  created() {
    const materiaId = this.$route.params.id;
    this.$store.dispatch("comum/obterMateria", { materiaId });
    this.$store.dispatch("aluno/obterExerciciosMateria", materiaId);
  },
};
</script>

<style scoped>
.exercicio-descricao {
  line-height: 14px;
  max-height: 28px;
  overflow: hidden;
  white-space: pre-wrap;
  padding: 0;
}
</style>