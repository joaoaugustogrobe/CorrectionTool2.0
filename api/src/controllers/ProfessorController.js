const Professor = require('../models/Professor');
const SessionController = require('./SessionController')

module.exports = {
  async authenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ status: "error", message: "Informações inválidas.", data: null })
    let professor
    try {
      professor = await Professor.findOne({ email });
      if (!professor) throw { status: "error", message: "Usuario ou senha incorretos.", data: null }
    } catch (e) {
      return res.status(400).send({ status: "error", ...e, data: null })
    }


    if (password != professor.password)
      return res.status(401).send({ status: "error", message: "Usuario ou senha incorretos.", data: null })


    let token = SessionController.generateToken({ id: professor._id, role: "professor" })
    res.cookie("x-access-token", token);
    return res.status(200).send({ status: "success", message: "Professor encontrado!!!", data: { user: {nome: professor.nome, role: "professor", gravatarUrl: professor.gravatarUrl, id: professor._id}, token: token } })

  },
};
