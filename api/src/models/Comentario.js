const mongoose = require('mongoose');


const comentarioSchema = new mongoose.Schema({
    resolucao: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resolucao',
        required: true
    },
    exercicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercicio',
        required: true
    },
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true
    },
    linha: {
        type: Number,
        required: true
    },
    comentario: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('comentario', comentarioSchema);
