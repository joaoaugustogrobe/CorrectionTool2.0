const Aluno = require('../models/Aluno');
const SessionController = require('./SessionController');
const crypto = require('crypto');
const Mailer = require('../services/Mailer');
const bcrypt = require('bcryptjs');

const {mapErrors} = require('../Validation/index');


module.exports = {
  async authenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ status: "error", message: "Informações inválidas.", data: null })
    let aluno;
    try {
      aluno = await Aluno.findOne({ email }).select('+salt +password');

      if (!aluno) throw { status: "error", message: "Usuario ou senha incorretos.", data: null }
    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null })
    }
    if (!bcrypt.compareSync(`${password}${aluno.salt}`, `${aluno.password}${aluno.salt}`))
      return res.status(401).send({ status: "error", message: "Usuario ou senha incorretos.", data: null });

    const token = SessionController.generateToken({ id: aluno._id, role: "aluno" })
    res.cookie("x-access-token", token);
    return res.status(200).send({ status: "success", message: "Aluno encontrado!!!", data: { user: { nome: aluno.nome, role: "aluno", gravatarUrl: aluno.gravatarUrl }, token } })

  },
  async store(req, res) {
    const { email, nome, password } = req.body;
    if (!email || !nome || !password)
      return res.status(400).send({ status: "error", message: "Informações inválidas.", data: null })

    let aluno = await Aluno.findOne({ email })
    if (aluno)
      return res.status(401).send({ status: "error", message: "Email já cadastrado.", data: null })

    aluno = await Aluno.create({
      email,
      nome,
      password
    })

    const token = SessionController.generateToken({ id: aluno._id, role: "aluno" });
    res.cookie("x-access-token", token);
    return res.status(200).send({ status: "success", message: "Aluno cadastrado!!!", data: { user: { nome: aluno.nome, role: "aluno", gravatarUrl: aluno.gravatarUrl }, token } })
  },

  async esqueciMinhaSenha(req, res) {
    const { email } = req.body;

    try {
      mapErrors(req).throw();
      const aluno = await Aluno.findOne({ email });

      const token = crypto.randomBytes(20).toString('hex');
      let dataExpiracao = new Date();
      dataExpiracao.setHours(dataExpiracao.getHours() + 1);

      if (aluno) {
        await Aluno.findByIdAndUpdate(aluno._id, {
          '$set': {
            tokenResetarSenha: token,
            tokenExpiracao: dataExpiracao,
          }
        });

        const mail = await Mailer.sendMail({
          to: email,
          from: 'noreply@joaocastilho.com.br',
          // template: 'forgot_password',
          template: 'forgot_password',
          context: { token, id: aluno._id },
        });
        console.log('mail', mail);
      }
    } catch (e) {
      console.log(e);
      return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
    }
    return res.status(200).send({
      status: "success", message: "Dentro de minutos, você receberá um email com as instruções de redefinição da sua senha.", data: {}
    });
  },

  async redefinirSenha(req, res) {
    const {alunoId, token, password} = req.body;
    
    try {
      mapErrors(req).throw();
      let aluno = await Aluno.findById(alunoId).select('+tokenExpiracao +tokenResetarSenha +salt');
      
      if(!aluno) throw "Aluno inexistente";

        if(token !== aluno.tokenResetarSenha) throw 'Token inválido';
        
        const now = new Date();
        if(now > aluno.tokenExpiracao) throw 'Token expirado';
        
        aluno.password = password + aluno.salt;
        aluno.tokenExpiracao = '';
        aluno.tokenResetarSenha = '';
        await aluno.save();
    } catch (e) {
      return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
    }
    return res.status(200).send({
      status: "success", message: "Senha resetada com sucesso.", data: {}
    });
  },
};
