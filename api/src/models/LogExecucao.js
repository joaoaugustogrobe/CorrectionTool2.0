const mongoose = require('mongoose');

const logExecucao = new mongoose.Schema({
    inicioExecucao: {
        type: Date,
        required: true
    },
    finalExecucao: {
        type: Date,
        required: true,
    },
    horarioAgendamento: {
        type: Date,
        required: true,
    },
    duracaoExecucao: {
        type: Number,
        required: true,
    },
    tempoEmEspera: {
        type: Number,
        required: true,
    },
    resolucao: {
        type: Object,
        required: false
    },
    exercicio: {
        type: Object,
        required: false,
    },
    corretorId: {
        type: String,
        default: '',
    },
});


module.exports = mongoose.model('LogExecucao', logExecucao);