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
        type: String,
        required: true,
    },
    tempoEmEspera: {
        type: String,
        required: true,
    },
    resolucao: {
        type: Object,
        required: false
    },
    exercicio: {
        type: Object,
        required: false,
    }
});


module.exports = mongoose.model('LogExecucao', logExecucao);