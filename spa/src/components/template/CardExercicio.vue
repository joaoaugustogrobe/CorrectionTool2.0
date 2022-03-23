<template>
  <v-card flat class="px-2 my-3" router :to="`/exercicio/${id}`" :loading="loading">
    <v-layout row wrap  :class="`${status} pa-3 exercicio card-exercicio justify-space-around d-flex`">
      <v-flex xs12 md5>
        <div class="caption grey--text">Nome do Exercício</div>
        <div>{{exercicioNome}}</div>
      </v-flex>
      <v-flex xs6 sm4 md2 v-if="materiaNome">
        <div class="caption grey--text">Matéria</div>
        <div>{{materiaNome}}</div>
      </v-flex>
      <v-flex xs2 sm4 md2>
        <div class="caption grey--text">Submissões</div>
        <div>{{submissoes}}</div>
      </v-flex>
      <v-flex xs6 sm4 md2>
        <div class="caption grey--text">Data final</div>
        <div>{{converterData(dataFinal)}}</div>
      </v-flex>
      <v-flex xs2 sm4 md1>
        <div class="text-right pr-12">
          <v-chip
            small
            :class="`${status} white--text my-2 caption v-chip--active`"
          >{{ status }}</v-chip>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import dataMixin from '../../util/date'

export default {
  mixins: [dataMixin],  
  props: {
    exercicioNome: {
      type: String,
      required: false
    },
    materiaNome: {
      type: String,
      required: false
    },
    submissoes: {
        type: Number,
        required: false
    },
    dataFinal: {
        type: [String, Number],
        required: false
    },
    status: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: false,
        default: ''
    },
    loading: {
        type: Boolean,
        required: false,
        default: false
    },
  }
};
</script>

<style>
.card-exercicio:hover{
  background-color: #dfdfdf;
  cursor: pointer;
}
.exercicio.aberto {
  border-left: 4px solid #3cd1c2;
}
.exercicio.finalizado {
  border-left: 4px solid tomato;
}
.exercicio.pendente {
  border-left: 4px solid orange;
}
.v-chip.aberto {
  background: #3cd1c2;
}
.v-chip.pendente {
  background: orange;
}
.v-chip.finalizado {
  background: tomato;
}
</style>