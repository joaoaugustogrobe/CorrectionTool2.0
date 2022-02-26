const mongoose = require('mongoose');

const exercicioSchema = new mongoose.Schema({
  prazo: {
    type: String,
    trim: true,
    required: true
  },
  titulo: {
    type: String,
    trim: true,
    required: true
  },
  nomeFuncao: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z_$][a-zA-Z_$0-9]{2,30}$/.test(v);
      },
      message: props => `${props.value} nomeFuncao inválido.`
    },
  },
  descricao: {
    type: String,
    trim: true,
    required: true
  },
  linguagem: {
    type: String,
    trim: true,
    required: false,
    default: "octave"
  },
  materia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materia',
    required: true
  },
  status: {
    type: String,
    required: false,
    default: "pendente"
  },
  submissoesCount: {
    type: Number,
    required: true,
    default: 0
  },
  visivel: {
    type: Boolean,
    default: false,
  },
  assinatura: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Exercicio', exercicioSchema);