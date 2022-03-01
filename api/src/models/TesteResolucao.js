const mongoose = require('mongoose');

const resolucaoTesteSchema = new mongoose.Schema({
    resolucao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resolucao',
        required: true
    },
    teste: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teste',
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
    output: {
        type: String,
        trim: true,
        required: true,
    },
    isError: {
        type: Boolean,
        default: false,
    },
    hadError: {
        type: Boolean,
        default: false,
    },
    versao: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })


module.exports = mongoose.model('TesteResolucao', resolucaoTesteSchema);