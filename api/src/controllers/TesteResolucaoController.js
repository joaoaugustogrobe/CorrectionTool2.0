const TesteResolucao = require('../models/TesteResolucao');

const { mapErrors } = require('../Validation/index');

module.exports = {
    async salvarEstadoErro(req, res) {
        const { user, testeResolucaoId, isError } = req.body;
        let testeResolucao;
        try {
            mapErrors(req).throw();
            console.log(testeResolucaoId, isError)
            if (await user.cannot("testeresolucao/salvar", { testeResolucaoId })) throw "Permissão insuficiente";
            console.log(2)
            testeResolucao = await TesteResolucao.findById(testeResolucaoId);
            testeResolucao.isError = isError;
            console.log(testeResolucao)
            await testeResolucao.save();
            console.log(4)


        } catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }
        return res.status(200).send({ status: "success", message: "Exercício salvo!!!", data: { testeResolucao } })
    },

};
