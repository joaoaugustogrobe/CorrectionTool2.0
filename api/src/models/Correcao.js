const mongoose = require('mongoose');
const comentarioSchema = require('./Comentario');

const correcaoSchema = new mongoose.Schema({
    resolucao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resolucao',
        required: true
    },
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true
    },
    exercicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercicio',
        required: true
    },
    notaCorrecao: {
        type: Number,
        required: true,
    }
}, { timestamps: true })

module.exports = mongoose.model('correcao', correcaoSchema);
