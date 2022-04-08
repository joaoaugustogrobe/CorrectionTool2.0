const mongoose = require('mongoose');
const md5 = require('md5')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const alunoSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  nome: {
    type: String,
    trim: true,
    required: true
  },
  gravatarUrl: {
    type: String,
    required: false,
    default: function () {
      return md5(this.email)
    }
  },
  salt: {
    type: String,
    default: () => crypto.randomBytes(20).toString('hex'),
    select: false,
  },
  tokenResetarSenha: {
    type: String,
    select: false
  },
  tokenExpiracao: {
    type: Date,
    select: false,
  }
});

alunoSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

module.exports = mongoose.model('Aluno', alunoSchema);