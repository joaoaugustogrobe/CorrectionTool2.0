const Aluno = require('../models/Aluno');
const SessionController = require('./SessionController')

module.exports = {
  async authenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).send({ status: "error", message: "Informações inválidas.", data: null })
    let aluno;
    try {
      aluno = await Aluno.findOne({ email });
      if (!aluno) throw { status: "error", message: "Usuario ou senha incorretos.", data: null }
    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null })
    }

    if (password != aluno.password)
      return res.status(401).send({ status: "error", message: "Usuario ou senha incorretos.", data: null })


    const token = SessionController.generateToken({ id: aluno._id, role: "aluno" })
    res.cookie("x-access-token", token);
    return res.status(200).send({ status: "success", message: "Aluno encontrado!!!", data: { user: {nome: aluno.nome,role: "aluno", gravatarUrl: aluno.gravatarUrl}, token } })

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
    return res.status(200).send({ status: "success", message: "Aluno cadastrado!!!", data: { user: {nome: aluno.nome, role: "aluno", gravatarUrl: aluno.gravatarUrl}, token } })
  }
};
