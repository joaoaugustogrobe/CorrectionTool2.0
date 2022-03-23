const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
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

adminSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password + this.salt, 10);
  this.password = hash;

  next();
});

module.exports = mongoose.model('Admin', adminSchema);