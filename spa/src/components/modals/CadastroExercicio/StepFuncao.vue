<template>
  <v-container>
    <v-form class="configuracoes" ref="form">
      <v-row class="configuracoes-form">
        <v-col cols="12">
          <ConfiguracaoItem
            label="Nome da função"
            v-model="form.nomeFuncao"
            textfield
            :descricao="`O Nome da função é usado no template do exercicio, disponivel para downloads para alunos, alterar o campo. Este campo não pode ser alterado posteriormente.`"
            :loading="loading"
            :rules="[rules.nomeFuncao]"
          />
        </v-col>
      </v-row>
      <v-row v-for="(input, index) in assinaturaFuncao" :key="index">
        <v-col cols="12">
          <ConfiguracaoItem :label="`Argumento ${index + 1}`">
            <v-text-field
              :value="input"
              dense
              outlined
              append-icon="mdi-content-copy"
              append-outer-icon="mdi-delete"
              :rules="[rules.required, rules.funcaoArgumento]"
              @input="(e) => onAtualizarInput(index, e)"
              @click:append="() => onCopy(input)"
              @click:append-outer="() => onRemoverInput(index)"
            />
          </ConfiguracaoItem>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ConfiguracaoItem
            :label="`Argumento ${assinaturaFuncao.length + 1}`"
            descricao="Novo argumento"
          >
            <v-text-field
              v-model="novoInput"
              dense
              outlined
              append-icon="mdi-content-copy"
              append-outer-icon="mdi-plus"
              :rules="[() => rules.assinaturaFuncao(assinaturaFuncao)]"
              @click:append-outer="onAdicionarNovoInput"
            />
          </ConfiguracaoItem>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TemplateExercicio
            :exercicio="form"
            :assinaturaFuncao="assinaturaFuncao"
          />
        </v-col>
      </v-row>
    </v-form>
    <div class="py-3 float-right">
      <v-btn
        v-if="!loading"
        class="mx-2"
        color="primary"
        @click="onProximoPasso"
        >Próximo</v-btn
      >
      <v-btn v-if="!loading" color="warning" outlined @click="onCancelar"
        >Cancelar</v-btn
      >
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
        nomeFuncao: '',
      },
      assinaturaFuncao: [],
      seletorData: false,
      novoInput: "",
      dayjs,
    };
  },
  methods: {
    async onProximoPasso() {
      if(!this.validarForm()) return;
      
      const res = await this.$store.dispatch('professor/criarExercicio', {...this.form, assinatura: this.assinaturaFuncao});
      if(res.ok)
        this.$emit("step", { step: 3, exercicio: res.data.data.exercicio });
      else
        this.$emit("step", { step: 1, exercicio: res.data.data.exercicio });
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
        nomeFuncao: this.exercicio && this.exercicio.titulo ? this.exercicio.titulo.replaceAll(' ', '').toLowerCase() : '',
      }
    },
    onRemoverInput(index) {
      this.assinaturaFuncao.splice(index, 1);
    },
    validarForm() {
      return this.$refs.form.validate();
    }
  },
  mounted() {
    this.resetarForm();
  },
  watch: {
    exercicio: {
      deep: true,
      handler(){
        this.resetarForm();
      }
    }
  }
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
</style>

