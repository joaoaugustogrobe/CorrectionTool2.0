const mongoose = require('mongoose');

const resolucaoSchema = new mongoose.Schema({
    resolucaoFilename: {
        type: String,
        trim: true,
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
    materia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materia',
        required: true
    },
    corrigido: {
        type: Boolean,
        default: false
    },
    tentativas: {
        type: Number,
        default: 1,
    },
    dataSubmissao: {
        type: "String",
        default: Date.now()
    },
    status: {
        type: String,
        required: false,
        default: "pendente"
    }
})


module.exports = mongoose.model('Resolucao', resolucaoSchema);