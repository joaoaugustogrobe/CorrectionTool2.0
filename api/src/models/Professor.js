const mongoose = require('mongoose');
const md5 = require('md5')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const professorSchema = new mongoose.Schema({
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
    required: true,
    default: function () {
      return md5(this.email)
    }
  },
  salt: {
    type: String,
    default: () => crypto.randomBytes(20).toString('hex'),
    select: false,
  },
});

professorSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(`${this.password}${this.salt}`, 10);
  this.password = hash;

  next();
});

module.exports = mongoose.model('Professor', professorSchema);