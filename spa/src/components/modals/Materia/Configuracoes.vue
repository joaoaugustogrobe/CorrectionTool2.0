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
              :value="(materia.lotacao / (materia.capacidade || 1)) * 100"
              color="orange"
            >
              <span>{{materia.lotacao}}/{{materia.capacidade}}</span>
              <small>alunos</small>
            </v-progress-circular>
          </v-col>
          <v-col cols="8" class="configuracoes-dashboard-detalhes">
            <div class="configuracoes-dashboard-dados">
              <span class="valor">{{materia.lotacao}}</span>
              <span class="chave">alunos</span>
            </div>
            <div class="configuracoes-dashboard-dados">
              <span class="valor">{{materia.capacidade - materia.lotacao}}</span>
              <span class="chave">vagas</span>
            </div>
            <div class="configuracoes-dashboard-dados" v-if="false">
              <span class="valor">{{materia.exercicios}}</span>
              <span class="chave">exercícios</span>
            </div>
          </v-col>
        </v-row>
        <v-row class="configuracoes-form">
          <v-col cols="12" class="mb-4">
            <ConfiguracaoItem
              v-model="form.status"
              label="Matéria ativa"
              descricao="Matérias ativas permitirão a matricula de novos alunos, criação e submissão de exercícios."
              has-switch
              :loading="loading"
              @input="onSalvar"
            />
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              v-model="form.nome"
              label="Nome"
              textfield
              :loading="loading"
            />
          </v-col>
          <v-col cols="12" v-if="false">
            <ConfiguracaoItem
              v-model="form.senha"
              label="Senha"
              textfield
              :loading="loading"
            />
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              :value="form.professor && form.professor.nome"
              label="Professor"
              :loading="loading"
              textfield
              disabled
            />
          </v-col>
          <v-col cols="12">
            <ConfiguracaoItem
              label="Capacidade"
              :descricao="`Capacidade de alunos da matéria. Capacidade atual: ${materia.capacidade} alunos`"
            >
              <v-slider
                v-model="form.capacidade"
                max="50"
                min="1"
                :loading="loading"
              ></v-slider>
            </ConfiguracaoItem>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-btn
      v-if="materiaAlterada && !loading"
      class="float-right mt-2 mx-2"
      color="primary"
      @click="onSalvar"
      >Salvar</v-btn
    >
    <v-btn
      v-if="materiaAlterada && !loading"
      class="float-right mt-2"
      color="warning"
      outlined
      @click="onCancelar"
      >Cancelar</v-btn
    >
  </div>
</template>

<script>
import ConfiguracaoItem from "../../configuracao/Item.vue";
import _ from "lodash";

export default {
  components: {
    ConfiguracaoItem,
  },
  props: {
    materia: {
      type: Object,
      required: true,
    },
  },
  computed: {
    materiaAlterada() {
      return !_.isEqual(this.materia, this.form);
    },
    loading() {
      return this.$store.state.loading["comum/salvarMateria"];
    },
  },
  data() {
    return {
      form: {},
    };
  },
  methods: {
    onSalvar() {
      this.$store.dispatch("comum/salvarMateria", {
        nome: this.form.nome,
        senha: this.form.senha,
        materiaId: this.form._id,
        capacidade: this.form.capacidade,
        status: this.form.status,
      });
    },
    onCancelar() {
      this.resetarForm();
    },
    resetarForm() {
      this.form = _.cloneDeep(this.materia);
    },
  },
  mounted() {
    this.resetarForm();
  },
  watch: {
    materia: {
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