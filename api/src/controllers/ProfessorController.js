const Professor = require('../models/Professor');
const SessionController = require('./SessionController');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Mailer = require('../services/Mailer');


const { mapErrors } = require('../Validation/index');

module.exports = {
  async authenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ status: "error", message: "Informações inválidas.", data: null })
    let professor
    try {
      professor = await Professor.findOne({ email }).select('+salt +password');
      if (!professor) throw { status: "error", message: "Usuario ou senha incorretos.", data: null }
    } catch (e) {
      return res.status(400).send({ status: "error", ...e, data: null })
    }


    if (!bcrypt.compareSync(`${password}${professor.salt}`, professor.password))
      return res.status(401).send({ status: "error", message: "Usuario ou senha incorretos.", data: null })


    let token = SessionController.generateToken({ id: professor._id, role: "professor" })
    res.cookie("x-access-token", token);
    return res.status(200).send({ status: "success", message: "Professor encontrado!!!", data: { user: { nome: professor.nome, role: "professor", gravatarUrl: professor.gravatarUrl, id: professor._id }, token: token } })

  },

  async store(req, res) {
    const { email, nome } = req.body;
    let professor;
    let token;
    let password = crypto.randomBytes(10).toString('hex');

    try {
      mapErrors(req).throw();

      professor = await Professor.findOne({ email })
      if (professor)
        return res.status(401).send({ status: "error", message: "Email já cadastrado.", data: null })

      professor = await Professor.create({
        email,
        nome,
        password
      });

      await Mailer.sendMail({
        to: email,
        from: '"Correction Tool" <noreply@joaocastilho.com.br>',
        subject: 'Bem vindo ao Correction Tool!',
        template: 'professor/invite',
        context: { email, password, host: process.env.SERVER_NAME, nome },
      });

      // token = SessionController.generateToken({ id: professor._id, role: "professor" });
      // res.cookie("x-access-token", token);
    }
    catch (e) {
      return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
    }

    return res.status(200).send({ status: "success", message: "Professor cadastrado!!!", data: { user: { nome: professor.nome, role: "professor", gravatarUrl: professor.gravatarUrl }, token } })
  },
};
