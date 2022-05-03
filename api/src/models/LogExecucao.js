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
    testeResolucao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true,
    },
});


module.exports = mongoose.model('LogExecucao', logExecucao);