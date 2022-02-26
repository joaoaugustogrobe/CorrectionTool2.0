<template>
  <v-dialog max-width="600px">
    <template v-slot:activator="{ on }" @click="novoExercicio">
      <v-btn class="amber accent-3" fixed bottom right fab v-on="on">
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2>Adicionar novo exercício</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            dense
            outlined
            label="Titulo"
            v-model="titulo"
            :rules="[rules.required, rules.min]"
          ></v-text-field>
          <v-textarea
            rows="3"
            auto-grow
            dense
            outlined
            label="Descrição"
            v-model="descricao"
            :rules="[rules.required, rules.min]"
          ></v-textarea>
          <v-text-field
            rows="3"
            dense
            outlined
            label="nomeFuncao"
            v-model="nomeFuncao"
            placeholder="decomposicaoLU"
            :rules="[rules.required, rules.nomeFuncao]"
          ></v-text-field>
          <v-select
            v-model="materia"
            :items="materias"
            item-text="nome"
            dense
            outlined
            label="Matéria"
            item-value="_id"
            chips
            clearable
            multiple
            :rules="[rules.required]"
          ></v-select>

          <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
            v-model="seletorData"
            ref="datepicker"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="dataFormatada"
                label="Data de entrega"
                v-on="on"
                prepend-icon="date_range"
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dataEntrega"
              @input="seletorData = false"
              locale="pt-BR"
              :date-format="(date) => new Date(date)"
            >
              <v-btn text color="primary" @click="seletorData = false"
                >Cencalar</v-btn
              >
              <v-btn text color="primary" @click="$refs.datepicker.save(date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>

          <v-btn
            class="success mx-0 mt-3"
            @click="submeter"
            :loading="submetendo"
            >Adicionar Matéria</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>





<script>
import dataMixin from "../../util/date";
import backend from "../../backend";
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
  mixins: [dataMixin],
  data() {
    return {
      descricao: "",
      titulo: "",
      seletorData: false,
      dataEntrega: "",
      nomeFuncao: "",
      materias: [],
      materia: ""
      rules: {
        min: (v) => v.length >= 15 || "Min 15 caracteres",
        nomeFuncao: (v) =>  /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(v) || "Função inválida",
        required: (value) => !!value || "Obrigatório.",
      },
      submetendo: false,
    };
  },
  methods: {
    submeter() {
      if (!this.validar()) return;
      this.submetendo = true;

      let exerciciosRequisicoes = [];
      this.materia.forEach((materia) => {
        // Para cada materia selecionada, adicione um exercicio
        let exercicio = {
          titulo: this.titulo,
          descricao: this.descricao,
          nomeFuncao: this.nomeFuncao,
          prazo: new Date(this.dataEntrega.replace(/-/g, "/")).getTime(),
          nota: 10,
          materiaId: materia,
        };
        let exercicioRequisicao;
        try {
          exercicioRequisicao = axios
            .post(`${backend.uri}/exercicio/create`, exercicio)
            .then((res) => {
              this.submetendo = false;
              exercicio = res.data.data.exercicio;
              this.log(exercicio);
              exercicio.nome = exercicio.descricao;
              exercicio.submissoes = 0;

              this.adicionarCallback(exercicio);
            });
        } catch (e) {
          throw e;
        }
        exerciciosRequisicoes.push(exercicioRequisicao);
      });

      Promise.all(exerciciosRequisicoes)
        .then(() => {
          this.$store.commit("core/showMessage", {
            content: "Exercicios adicionados com sucesso!",
            error: false,
          });
        })
        .catch(() => {
          this.$store.commit("core/showMessage", {
            content: "Erro ao adicionar um ou mais exercícios.",
            error: true,
          });
        });
    },
    validar() {
      return this.$refs.form.validate();
    },
    log(a) {
      /* eslint-disable no-console */
      console.log(a);
      /* eslint-enable no-console */
    },
    resetar() {
      this.$refs.form.reset();
      this.nomeMateria = "";
      this.senhaMateria = "";
      this.exibirSenha = false;
      this.capacidade = 45;
    },
  },
  computed: {
    dataFormatada() {
      let data = new Date(this.dataEntrega.replace(/-/g, "/")).getTime();
      return data ? this.converterData(data) : "";
    },
  },
  created() {
    axios.get(`${backend.uri}/materia`).then((res) => {
      let materias = res.data.data;
      this.materias = materias.map((materia) => {
        return { nome: materia.nome, _id: materia._id };
      });
    });
  },
  props: {
    adicionarCallback: {
      type: Function,
      required: false,
    },
  },
};
</script>

<style>
</style>