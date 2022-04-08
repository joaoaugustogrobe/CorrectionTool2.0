<template>
  <v-container>
    <div class="d-flex flex-column align-items-center">
      <h2>Seu exercício esta pronto.</h2>
      <h3>Você pode finalizar adicionando testes</h3>
      <div class="py-3 float-right">
        <v-btn v-if="!loading" outlined @click="onAdicionarTestes"
          >Mais tarde</v-btn
        >
        <v-btn v-if="!loading" color="primary" @click="onAdicionarTestes" class="ml-3"
          >Vamos lá!</v-btn
        >
      </div>
    </div>
  </v-container>
</template>

<script>
const dayjs = require("dayjs");
dayjs.locale("pt-br");

import ConfiguracaoItem from "../../configuracao/Item.vue";
import dateMixin from "../../../util/date";
import inputMixin from "../../../util/inputs";
import TemplateExercicio from "../../comum/TemplateExercicio.vue";
import _ from "lodash";

import { mapGetters } from "vuex";

export default {
  mixins: [dateMixin, inputMixin],
  components: {
    ConfiguracaoItem,
    TemplateExercicio,
  },
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("comum", ["obterMaterias"]),
    exercicioAlterado() {
      return !_.isEqual(this.exercicio, this.form);
    },
    loading() {
      return this.$store.state.loading["professor/salvarExercicio"];
    },
    dateEntregaRelativo() {
      return this.dataRelativa(this.form.prazo);
    },
    dataEntregaISO() {
      return dayjs(new Date(parseInt(this.form.prazo))).format("YYYY-MM-DD");
    },
    dataEntregaTimestamp() {
      return dayjs(this.dataEntregaISO).valueOf();
    },
    dataEntregaDisplay() {
      return dayjs(new Date(parseInt(this.form.prazo))).format(
        "MMM D, YYYY - HH:mm"
      );
    },
    materias() {
      return this.obterMaterias;
    },
  },
  data() {
    return {
      form: {
        nomeFuncao: "",
      },
      assinaturaFuncao: [],
      seletorData: false,
      novoInput: "",
      dayjs,
    };
  },
  methods: {
    async onAdicionarTestes() {
      this.$modal.hide("cadastro-exercicio");

      setTimeout(() => {
        this.$router.push(`/exercicio/${this.exercicio._id}`);
      }, 300) //fade animation
    },
    onCancelar() {
      this.$modal.hide("cadastro-exercicio");
    },
    onAdicionarNovoInput() {
      if (this.novoInput) {
        // this.$set(this.form.assinaturaFuncao, this.form.assinaturaFuncao.length, this.novoInput);
        this.assinaturaFuncao.push(this.novoInput);
        this.novoInput = "";
      }
    },
    onAtualizarInput(index, input) {
      this.assinaturaFuncao.splice(index, 1, input);
    },
    resetarForm() {
      this.form = {
        ..._.cloneDeep(this.exercicio),
        nomeFuncao:
          this.exercicio && this.exercicio.titulo
            ? this.exercicio.titulo.replaceAll(" ", "").toLowerCase()
            : "",
      };
    },
    onRemoverInput(index) {
      this.assinaturaFuncao.splice(index, 1);
    },
    validarForm() {
      return this.$refs.form.validate();
    },
  },
  mounted() {
    this.resetarForm();
  },
  watch: {
    exercicio: {
      deep: true,
      handler() {
        this.resetarForm();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.configuracoes-dashboard {
  border-bottom: 1px solid #e0e0e0;
  .configuracoes-dashboard-detalhes {
    display: flex;
    align-items: center;
    padding-top: 0;
    .configuracoes-dashboard-dados {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 30px;
      border-right: 1px solid #bdbdbd;

      &:last-child {
        border-right: none;
      }

      .valor {
        font-size: 15px;
        line-height: 20px;
        font-weight: 700;
      }
      .chave {
        font-size: 12px;
        line-height: 18px;
      }
    }
  }

  ::v-deep .v-progress-circular {
    circle {
      stroke-linecap: round;
    }
    .v-progress-circular__info {
      font-size: 14px;
      line-height: 17px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
    }
  }
}
.configuracoes {
  .configuracoes-form {
    padding: 1.5rem 0;
    .col {
      padding: 0 12px;
    }
    label {
      display: block;
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      margin-bottom: 18px;
    }
  }
}
.align-items-center {
  align-items: center;
}
</style>

