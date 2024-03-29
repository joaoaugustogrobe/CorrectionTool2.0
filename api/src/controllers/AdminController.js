const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const {mapErrors} = require('../Validation/index');
const SessionController = require('./SessionController');



module.exports = {
    async authenticate(req, res) {
        const { email, password } = req.body;
        let admin;

        try {
            mapErrors(req).throw();

            const isAdminCreated = await Admin.findOne();
            if(!isAdminCreated){
              await Admin.create({
                email: process.env.API_ADMIN_EMAIL,
                password: process.env.API_ADMIN_PASSWORD
              });
            }
              
            admin = await Admin.findOne({ email }).select('+salt +password');

            if (!admin) throw "Usuario ou senha incorretos.";

            if (!bcrypt.compareSync(password + admin.salt, admin.password))
                return res.status(401).send({ status: "error", message: "Usuario ou senha incorretos.", data: null });
        } catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }

        const token = SessionController.generateToken({ id: admin._id, role: "admin" })
        res.cookie("x-access-token", token);
        return res.status(200).send({ status: "success", message: "admin encontrado!!!", data: { user: { nome: admin.nome, role: "admin" }, token } });
    },
}