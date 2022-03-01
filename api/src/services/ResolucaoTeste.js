const Exercicio = require('../models/Exercicio');
const Teste = require('../models/Teste');
const Resolucao = require('../models/Resolucao');
const TesteResolucao = require('../models/TesteResolucao');

module.exports = {
  //Executado pelo broker após executar um exercicio
  async armazenarOutput(payload) {
    const { input, materia, exercicio, aluno, resolucao, teste, output, versao } = payload;
    // const _output = parseOutput(payload.output);

    try {
      const index = output.indexOf("ans =");
      const isError = index === -1;
      let res = await TesteResolucao.create({
        resolucao,
        teste,
        output: isError ? output : output.slice(index),
        aluno,
        exercicio,
        isError: isError,
        hadError: isError,
        versao,
      });
      if (!res) throw e;  //TODO handle error

      const exercicioObj = await Exercicio.findById(exercicio);
      if (!exercicioObj) throw 'Exercício inexistente';

      const resolucaoObj = await Resolucao.findById(resolucao);
      if (!resolucaoObj) throw 'Resolução inexistente';



      //Verifica se existem outras correções do mesmo exercicio sendo executadas
      const testesExercicio = await Teste.find({ exercicio });
      const resolucoesExercicio = await TesteResolucao.find({ resolucao, versao });

      if (resolucoesExercicio.length === testesExercicio.length) {
        resolucaoObj.status = 'ok';
        await resolucaoObj.save();
      }


      console.log(`[INFO] - Correção registrada. ${resolucoesExercicio.length}/${testesExercicio.length}`);

    } catch (e) {
      console.error(e);
    }

  },
};


function parseOutput(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 11) {
      output += input.charAt(i);
    }
  }
  return output;
}
