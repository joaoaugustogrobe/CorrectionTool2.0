<template>
  <div>
    <v-form class="configuracoes">
      <v-container>
        <v-row class="section">
          <v-col class="py-0">
            <h2 class="section-title">Informações</h2>
          </v-col>
        </v-row>
        <v-row class="configuracoes-dashboard">
          <v-col class="pt-0 pb-4" cols="3">
            <v-progress-circular
              :rotate="-90"
              :size="100"
              :width="15"
              :value="correcoesPendentes / exercicio.submissoesCount"
              color="orange"
            >
              <span
                >{{ exercicio.submissoesCount }}/{{ correcoesPendentes }}</span
              >
              <small>submissões</small>
            </v-progress-circular>
          </v-col>
          <v-col cols="8" class="configuracoes-dashboard-detalhes">
            <div class="configuracoes-dashboard-dados">
              <span class="valor">{{ exercicio.submissoesCount }}</span>
              <span class="chave">submissões</span>
            </div>
            <div class="configuracoes-dashboard-dados">
              <span class="valor">{{ correcoesPendentes }}</span>
              <span class="chave">correções pendentes</span>
            </div>
            <div class="configuracoes-dashboard-dados">
              <span class="valor">{{ dateEntregaRelativo }}</span>
              <span class="chave">entrega</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="configuracoes-form">
          <v-col cols="12" class="mb-4">
            <ConfiguracaoItem
              v-model="form.visivel"
              label="Exercício ativo"
              descricao="Exercícios inativos não serão exibidos para alunos, ideal para a configuração de testes."
              has-switch
              :loading="loading"
              @input="onSalvar"
            />
          </v-col>
          <!-- <v-col cols="12" class="mb-4">
            <ConfiguracaoItem
              v-model="form.status"
              label="Submissões atrasadas"
              descricao="Altera entre aceitar ou não atividades após o prazo de entrega. Atividades atrazadas serão exibidas diferentemente."
              has-switch
              :loading="loading"
              @input="onSalvar"
            />
          </v-col> -->
          <v-col cols="12">
            <ConfiguracaoItem
              v-model="form.titulo"
              label="Título"
              textfield
              :loading="loading"
            />
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem label="Descrição" :loading="loading">
              <v-textarea outlined class="mt-2" v-model="form.descricao" />
            </ConfiguracaoItem>
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              label="Data de entrega"
              :descricao="`Data de entrega final do exercício. Submissões á partir deste horário serão marcadas como atrazadas.`"
            >
              <v-menu
                ref="menu"
                v-model="seletorData"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dataEntregaDisplay"
                    class="mt-2"
                    prepend-icon="mdi-calendar"
                    outlined
                    dense
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :value="dataEntregaISO"
                  @input="atualizarDataISO"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(form.prazo)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </ConfiguracaoItem>
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              :value="form.nomeFuncao"
              label="Nome da função"
              :descricao="`O Nome da função é usado no template do exercicio, disponivel para downloads para alunos, alterar o campo. Este campo não pode ser alterado.`"
              :loading="loading"
              textfield
              disabled
            />
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              :value="form.materia && form.materia.nome"
              label="Matéria"
              :loading="loading"
              textfield
              disabled
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <div class="py-3 float-right">
      <v-btn
        v-if="exercicioAlterado && !loading"
        class="mx-2"
        color="primary"
        @click="onSalvar"
        >Salvar</v-btn
      >
      <v-btn
        v-if="exercicioAlterado && !loading"
        color="warning"
        outlined
        @click="onCancelar"
        >Cancelar</v-btn
      >
    </div>
  </div>
</template>

<script>
const dayjs = require("dayjs");
dayjs.locale("pt-br");

import ConfiguracaoItem from "../../configuracao/Item.vue";
import dateMixin from "../../../util/date";
import _ from "lodash";

export default {
  mixins: [dateMixin],
  components: {
    ConfiguracaoItem,
  },
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    exercicioAlterado() {
      return !_.isEqual(this.exercicio, this.form);
    },
    loading() {
      return this.$store.state.loading["professor/salvarExercicio"];
    },
    submissoes() {
      return this.$store.getters["professor/obterTodasSubmissoesExercicio"](
        this.exercicio._id,
        this.exercicio.materia._id
      );
    },
    correcoesPendentes() {
      return this.submissoes.length - this.exercicio.submissoesCount;
    },
    dateEntregaRelativo() {
      return this.dataRelativa(this.exercicio.prazo);
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
  },
  data() {
    return {
      form: {},
      seletorData: false,
      dayjs,
    };
  },
  methods: {
    onSalvar() {
      this.$store.dispatch("professor/salvarExercicio", this.form);
    },
    onCancelar() {
      this.resetarForm();
    },
    resetarForm() {
      this.form = _.cloneDeep(this.exercicio);
    },
    atualizarDataISO(data) {
      this.form.prazo = String(
        dayjs(data).add(1, "day").subtract(1, "minute").valueOf()
      );
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
</style>