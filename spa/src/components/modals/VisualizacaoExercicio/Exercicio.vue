<template>
  <Modal
    name="visualizar-exercicio"
    className="visualizar-exercicio"
    :title="exercicio && exercicio.titulo"
    @before-open="onOpen"
    @before-close="onClose"
  >
    <template v-slot:tabs>
      <ul>
        <li class="item-title">
          {{ "Configurações do exercício".toUpperCase() }}
        </li>
        <li
          :class="{ active: pagina === 'dashboard' }"
          @click="pagina = 'dashboard'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'Exercicio',
          }"
        >
          <v-icon>mdi-text-box</v-icon>
          <span>Exercicio</span>
        </li>

        <li
          :class="{ active: pagina === 'resolucao' }"
          @click="pagina = 'resolucao'"
          v-tooltip="{
            delay: { show: 500 },
            content: 'Submissão',
          }"
        >
          <v-icon>fa-code</v-icon>
          <span>Submissão</span>
          <v-progress-circular
            v-if="buscandoResolucao"
            indeterminate
            color="gray"
            class="mr-4 mt-3 float-right"
            size="16"
          />
          <v-chip
            v-else
            x-small
            class="float-right mt-3"
            color="yellow"
            style="pointer-events: none"
            ><small>Novo</small></v-chip
          >
        </li>
      </ul>
    </template>
    <template class="body" v-slot:header>
      <h1>Teste</h1>
    </template>
    <template class="body" v-slot:body>
      <AlunoDashboard :exercicio="exercicio" v-if="pagina == 'dashboard'" @novaPagina="onNovaPagina"/>
      <template v-else-if="pagina == 'resolucao'">
        <Resolucao
          v-if="submissao && submissao._id"
          :submissao="submissao"
          :exercicio="exercicio"
          class="mb-3"
        />
        <SubmeterResolucao :exercicio="exercicio" :submissao="submissao"/>
      </template>
    </template>
  </Modal>
</template>

<script>
import Modal from "../Modal.vue";
import Resolucao from "../../template/ResolucaoItem.vue";
import AlunoDashboard from "../../modals/Exercicio/AlunoDashboard.vue";
import SubmeterResolucao from "../../template/SubmeterResolucao.vue";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      pagina: "dashboard",
      materiaId: null,
      exercicioId: null,
      resolucaoPoolingInterval: null,
    };
  },
  components: {
    Modal,
    Resolucao,
    AlunoDashboard,
    SubmeterResolucao,
  },
  computed: {
    ...mapGetters("aluno", ["obterExercicio", "obterResolucao"]),
    exercicio() {
      return this.obterExercicio({
        exercicioId: this.exercicioId,
        materiaId: this.materiaId,
      });
    },
    submissao() {
      return this.obterResolucao(this.exercicioId);
    },
    buscandoResolucao() {
      return this.$store.state.loading["aluno/obterResolucao"];
    },
    deveAtualizarResolucao() {
      if (!this.submissao || this.submissao.status == "ok") return false;

      return true;
    },
  },
  methods: {
    async onOpen({ params }) {
      if (params) {
        this.exercicioId = params.exercicio._id;
        this.materiaId = params.exercicio.materia;
        this.pagina = params.tab ? params.tab : "dashboard";

        await this.$store.dispatch("aluno/obterResolucao", this.exercicioId);
      }

      this.resolucaoPooling();
    },
    onNovaPagina(pagina){
      this.pagina = pagina;
    },
    onClose() {
      this.pagina = "dashboard";
      clearInterval(this.resolucaoPoolingInterval);
    },
    resolucaoPooling() {
      //long pooling of this request, interval of 10 seconds
      this.resolucaoPoolingInterval = setInterval(() => {
        if (this.deveAtualizarResolucao) {
          console.log("atualizando resolucao");
          this.$store.dispatch("aluno/obterResolucao", this.exercicio._id);
        }
      }, 10000);
    },
  },
};
</script>

<style>
</style>