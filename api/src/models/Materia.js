const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema({
  nome: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  },
  lotacao: {
    type: Number,
    required: false,
    default: 0
  },
  capacidade: {
    type: Number,
    required: false,
    default: 25
  },
  status: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model('Materia', materiaSchema);