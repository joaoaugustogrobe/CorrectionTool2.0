<template>
  <v-container class="my-5">
    <v-flex>
      <v-row v-if="resolucao" class="pb-1">
        <v-col class="py-0">
          <v-alert
            dense
            type="secondary"
            v-if="exercicio && resolucao && resolucao.status === 'pendente'"
          >
            <strong>{{ resolucao.resolucaoFilename }}</strong>
            adicionado a fila de execução.
          </v-alert>
          <v-alert
            dense
            type="success"
            close-icon="d-flex align-items-center"
            v-else-if="
              exercicio &&
              resolucao &&
              resolucao.status === 'ok' &&
              resolucao.corrigido
            "
          >
            Correção para
            <strong>{{ resolucao.resolucaoFilename }}</strong>
            esta pronta.

            <v-btn
              name="append"
              class="float-right"
              outlined
              small
              @click="onVisualizarResolucao"
              >Visualizar</v-btn
            >
            <v-progress-circular
              v-if="buscandoResolucao"
              indeterminate
              color="gray"
              class="mr-4 mt-1 float-right"
              size="20"
            />

            <small class="float-right pt-1 pr-4" v-else>{{
              dataRelativa(resolucao.timestamp)
            }}</small>
          </v-alert>
          <v-alert
            dense
            type="success"
            @click="onVisualizarResolucao"
            v-else-if="
              exercicio &&
              resolucao &&
              resolucao.status === 'ok' &&
              !resolucao.corrigido
            "
          >
            Detalhes sobre a execução de
            <strong>{{ resolucao.resolucaoFilename }}</strong>
            estão disponiveis.
            <v-btn
              name="append"
              class="float-right"
              outlined
              small
              @click="onVisualizarResolucao"
              >Visualizar</v-btn
            >
          </v-alert>
        </v-col>
      </v-row>
      <v-card>
        <v-card-title
          >{{ exercicio.titulo }} · {{ assinaturaFuncao }}</v-card-title
        >
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
          <v-row>
            <span class="exercicio-descricao">{{ exercicio.descricao }}</span>
          </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn text v-if="false">
              <v-icon>help_outline</v-icon>
              <span>Ajuda</span>
            </v-btn>
            <v-btn
              outlined
              color="green"
              @click="onVisualizarResolucao"
              >Enviar</v-btn
            >
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-card v-if="testes.length" class="my-5">
      <v-flex>
        <v-stepper v-model="stepperAtivo">
          <v-stepper-header>
            <template v-for="(teste, index) in testes">
              <v-stepper-step
                :key="`${index}-step`"
                :step="index"
                editable
                @click="onSelecionarStep(index)"
                >{{ teste.nome }}</v-stepper-step
              >
              <v-divider
                v-if="index + 1 !== testes.length"
                :key="index"
              ></v-divider>
            </template>
          </v-stepper-header>
          <v-stepper-items>
            <v-stepper-content
              v-for="(teste, index) in testes"
              :step="index"
              :key="index"
            >
              <div class="px-4 py-4">
                <v-form v-if="stepperAtivo !== -1" ref="form">
                  <v-row>
                    <v-col cols="12" class="mb-4" v-if="teste.isPrivate">
                      <span class="d-flex justify-content-center">
                        <v-icon class="mr-1">lock</v-icon>Este teste é privado,
                        informações de input serão restritas.</span
                      >
                    </v-col>
                    <v-col cols="12">
                      <h4>{{ teste.nome }}</h4>
                      <h5 v-if="teste.isError">{{ teste.mensagemErro }}</h5>
                      <BlocoDeCodigo
                        :codigo="assinaturaTeste(teste)"
                        disabled
                        class="my-2"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="!teste.isPrivate">
                    <v-col>
                      <ConfiguracaoItem
                        :label="assinaturaArg"
                        v-for="(assinaturaArg, index) in exercicio.assinatura"
                        :key="index"
                      >
                        <v-text-field
                          :value="teste.input[index]"
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          disabled
                          @input="
                            (e) => onAtualizarInput(teste.input[index], e)
                          "
                          @click:append="() => onCopy(teste.input[index])"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                  <v-row v-if="!teste.isPrivate">
                    <v-col>
                      <ConfiguracaoItem label="Output">
                        <v-text-field
                          :value="teste.output"
                          disabled
                          dense
                          outlined
                          append-icon="mdi-content-copy"
                          @click:append="() => onCopy(teste.output)"
                        />
                      </ConfiguracaoItem>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-flex>
    </v-card>
  </v-container>
</template>

<script>
import dataMixin from "../../../util/date";
import { mapGetters } from "vuex";

import ConfiguracaoItem from "../../configuracao/Item.vue";
import BlocoDeCodigo from "../../../components/BlocoDeCodigo.vue";

export default {
  mixins: [dataMixin],
  components: {
    ConfiguracaoItem,
    BlocoDeCodigo,
  },
  data: () => {
    return {
      stepperAtivo: -1,
    };
  },
  props: {
    exercicio: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onEdit() {
      this.$modal.show("alterar-exercicio", { exercicio: this.exercicio });
    },
    onVisualizarResolucao() {
      this.$emit('novaPagina', 'resolucao');
    },
    assinaturaTeste(teste) {
      const parametros = teste.input.reduce((anterior, input) => {
        return anterior ? `${anterior}, ${input}` : input;
      }, "");

      // const assinatura = `${this.exercicio.nomeFuncao}(${parametros})`;
      return `${teste.isPrivate ? "% Informações de input restritas.\n" : ""}${
        this.exercicio.nomeFuncao
      }(${parametros})`;
    },
    onSelecionarStep(e) {
      if (e == this.stepperAtivo) {
        this.$nextTick(() => {
          this.stepperAtivo = -1;
        });
      }
    },

    async init() {
      this.$store.dispatch("comum/obterMateria", { materiaId: this.materiaId });
      this.$store.dispatch("aluno/obterExerciciosMateria", this.materiaId);
      this.$store.dispatch("comum/obterTestesExercicio", {
        exercicioId: this.exercicio._id,
      });

      const reqResolucao = await this.$store.dispatch(
        "aluno/obterResolucao",
        this.exercicio._id
      );
      if (reqResolucao.ok && reqResolucao.data.resolucao)
        await this.$store.dispatch(
          "comum/obterDadosExecucao",
          reqResolucao.data.resolucao._id
        );

      if (this.testes.length) this.stepperAtivo = 0;
    },
  },

  computed: {
    ...mapGetters("comum", ["obterMateria", "obterTestes"]),
    ...mapGetters("aluno", ["obterExercicio", "obterResolucao"]),
    ...mapGetters("core", ["user", "isProfessor", "isAluno"]),
    materia() {
      if (!this.exercicio.materia) return {};
      return this.obterMateria(this.exercicio?.materia?._id);
    },
    submissoes() {
      return this.$store.getters["professor/obterTodasSubmissoesExercicio"](
        this.exercicio._id,
        this.materia._id
      );
    },
    materiaId() {
      return this.exercicio.materia;
    },
    testes() {
      return this.obterTestes(this.exercicio._id);
    },
    resolucao() {
      return this.obterResolucao(this.exercicio._id);
    },
    buscandoResolucao() {
      return this.$store.state.loading["aluno/obterResolucao"];
    },
    assinaturaFuncao() {
      const parametros = this.exercicio?.assinatura?.reduce(
        (anterior, input) => {
          return anterior ? `${anterior}, ${input}` : input;
        },
        ""
      );

      // const assinatura = `${this.exercicio.nomeFuncao}(${parametros})`;
      return `${this.exercicio.nomeFuncao}(${parametros})`;
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>