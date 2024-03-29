const Exercicio = require('../models/Exercicio');
const Teste = require('../models/Teste');
const Matricula = require('../models/Matricula')

const { mapErrors } = require('../Validation/index');

module.exports = {
    async store(req, res) {
        const { user, input, output, exercicioId, isPrivate, nome, mensagemErro } = req.body;

        let teste;
        try {
            mapErrors(req).throw();
            if (await user.cannot("teste/criar", { exercicioId })) throw "Permissão insuficiente";

            teste = await Teste.create({
                nome,
                input,
                output,
                isPrivate,
                mensagemErro,
                exercicio: exercicioId,
            })

        } catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }

        return res.status(200).send({ status: "success", message: "Teste cadastrado!!!", data: { teste } })
    },

    async getTestesExercicio(req, res) {
        const { userId, role } = req.body;
        const { exercicioId } = req.params;

        let testes
        try {
            if (!exercicioId)
                return res.status(401).send({ status: "error", message: e.message, data: null })

            let exercicio = await Exercicio.findById(exercicioId).populate("materia")
            if (!exercicio)
                return res.status(401).send({ status: "error", message: "Exercicio inválido", data: null })

            if (role == "professor") {
                if (exercicio.materia.professor != userId)
                    return res.status(401).send({ status: "error", message: "Exercicio não pertence a este professor.", data: null })
                testes = await Teste.find({ exercicio: exercicioId })
            }
            else if (role == "aluno") {
                let matricula = await Matricula.find({ aluno: userId, materia: exercicio.materia })
                if (!matricula)
                    return res.status(401).send({ status: "error", message: "Aluno não esta matriculado na matéria", data: null })
                testes = await Teste.find({ exercicio: exercicioId })
                testes.map(teste => {
                    if (teste.isPrivate) {
                        teste.input = ['???']
                        teste.output = '???'
                    }
                    return teste
                })
            }

        } catch (e) {
            return res.status(401).send({ status: "error", message: e.message, data: null })
        }
        return res.status(200).send({ status: "success", message: "Teste obtidos com sucesso!!!", data: { testes } })
    },

    async salvar(req, res) {
        const { user, testeId, input, output, isPrivate, nome, mensagemErro } = req.body;
        let teste;

        try {
            mapErrors(req).throw();
            if (await user.cannot("teste/salvar", { testeId })) throw "Permissão insuficiente";

            teste = await Teste.findById(testeId);
            teste.input = input;
            teste.output = output;
            teste.isPrivate = isPrivate;
            teste.nome = nome;
            teste.mensagemErro = mensagemErro;

            await teste.save();
        }
        catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }
        return res.status(200).send({ status: "success", message: "Exercício salvo!!!", data: { teste } })

    },


    async deletar(req, res) {
        const { user, testeId } = req.body;

        try {
            mapErrors(req).throw();
            if (await user.cannot("teste/deletar", { testeId })) throw "Permissão insuficiente";
            await Teste.deleteOne({_id: testeId});
        } catch (e) {
            return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });
        }

        return res.status(200).send({ status: "success", message: "Teste deletado com sucesso!!!" })
    }
};
