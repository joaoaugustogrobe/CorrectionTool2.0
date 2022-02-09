const mongoose = require('mongoose');

const testeSchema = new mongoose.Schema({
    input: {
        type: Array,
        required: true
    },
    output: {
        type: String,
        trim: true,
        required: true
    },
    exercicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercicio',
        required: true
    },
    nome: {
        type: String,
        default: '',
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('Teste', testeSchema);