<template>
  <div>
    <v-form class="configuracoes" ref="form">
      <v-row class="configuracoes-form">
        <v-col cols="12">
          <ConfiguracaoItem label="Matéria">
            <v-select
              v-model="form.materiaId"
              :items="materias"
              :loading="loading"
              item-text="nome"
              dense
              outlined
              item-value="_id"
              :rules="[rules.required]"
            ></v-select>
          </ConfiguracaoItem>
        </v-col>

        <!-- <v-col cols="12" class="mb-4">
            <ConfiguracaoItem
              v-model="form.status"
              label="Submissões atrasadas"
              descricao="Altera entre aceitar ou não atividades após o prazo de entrega. Atividades atrazadas serão exibidas diferentemente."
              has-switch
              :loading="loading"
              @input="onProximoPasso"
            />
          </v-col> -->
        <v-col cols="12">
          <ConfiguracaoItem
            v-model="form.titulo"
            label="Título"
            textfield
            :loading="loading"
            :rules="[rules.required, (v) => rules.min(v, 6)]"
          />
        </v-col>
        <v-col cols="12">
          <ConfiguracaoItem label="Descrição" :loading="loading">
            <v-textarea outlined class="mt-2" v-model="form.descricao" :rules="[rules.required, (v) => rules.min(v, 6)]"/>
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
                  :rules="[rules.required, () => rules.unixTimestamp(dataEntregaTimestamp)]"
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
        <v-col cols="12" class="mb-4">
          <ConfiguracaoItem
            v-model="form.visivel"
            label="Exercício ativo"
            descricao="Exercícios inativos não serão exibidos para alunos, ideal para a configuração de testes."
            has-switch
            :loading="loading"
          />
        </v-col>
      </v-row>
    </v-form>
    <div class="py-3 float-right">
      <v-btn v-if="!loading" class="mx-2" color="primary" @click="onProximoPasso"
        >Próximo</v-btn
      >
      <v-btn v-if="!loading" color="warning" outlined @click="onCancelar"
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
import inputMixin from "../../../util/inputs";
import _ from "lodash";

import { mapGetters } from "vuex";

export default {
  mixins: [dateMixin, inputMixin],
  components: {
    ConfiguracaoItem,
  },
  computed: {
    ...mapGetters("professor", ["obterMaterias"]),
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
        prazo: new Date().valueOf(),
        visivel: false,
      },
      seletorData: false,
      dayjs,
    };
  },
  methods: {
    onProximoPasso() {
      if(this.validarForm())
        this.$emit('step', {step: 2, exercicio: this.form});
    },
    onCancelar() {
      this.$modal.hide("cadastro-exercicio");
    },
    atualizarDataISO(data) {
      this.form.prazo = String(
        dayjs(data).add(1, "day").subtract(1, "minute").valueOf()
      );
    },
    validarForm() {
      return this.$refs.form.validate();
    }
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