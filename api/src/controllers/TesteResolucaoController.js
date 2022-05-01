const TesteResolucao = require('../models/TesteResolucao');
const Resolucao = require('../models/Resolucao');

const { mapErrors } = require('../Validation/index');

module.exports = {
    async salvarEstadoErro(req, res) {
        const { user, testeResolucaoId, isError } = req.body;
        let testeResolucao;
        try {
            mapErrors(req).throw();
            if (await user.cannot("testeresolucao/salvar", { testeResolucaoId })) throw "Permissão insuficiente";
            testeResolucao = await TesteResolucao.findById(testeResolucaoId);
            testeResolucao.isError = isError;
            await testeResolucao.save();

            const resolucao = await Resolucao.findById(testeResolucao.resolucao);
            if(!resolucao.corrigido) { // calcular nota novamente
                const resolucoesExercicio = await TesteResolucao.find({ resolucao, versao: testeResolucao.versao });
                const testesCorretos = resolucoesExercicio.filter(resolucao => !resolucao.isError);
        
                resolucao.status = 'ok';
                resolucao.nota = (testesCorretos.length / resolucoesExercicio.length * 100).toFixed(1);
                await resolucao.save();
            }


        } catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }
        return res.status(200).send({ status: "success", message: "Exercício salvo!!!", data: { testeResolucao } })
    },

};
