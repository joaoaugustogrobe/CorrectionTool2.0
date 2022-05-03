const Exercicio = require('../models/Exercicio');
const Teste = require('../models/Teste');
const Resolucao = require('../models/Resolucao');
const LogExecucao = require('../models/LogExecucao');
const TesteResolucao = require('../models/TesteResolucao');
const Difference = require('./Difference');

module.exports = {
  //Executado pelo broker após executar um exercicio
  async armazenarOutput(payload) {
    console.log('==========')
    console.log('armazenarOutput para: ', payload.versao);
    const { input, materia, exercicio, aluno, resolucao, teste, output, versao, meta } = payload;
    // const _output = parseOutput(payload.output);

    try {
      const _teste = await Teste.findById(teste);
      if(!_teste) throw e;

      const isError = Difference.diff(_teste.output, output);
      let res = await TesteResolucao.create({
        resolucao,
        teste,
        output,
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
        const accurateTests = resolucoesExercicio.filter(resolucao => !resolucao.isError);
        
        resolucaoObj.status = 'ok';
        resolucaoObj.nota = (accurateTests.length / resolucoesExercicio.length * 100).toFixed(1);
        await resolucaoObj.save();
      }

      console.log(`[INFO] - Correção registrada. ${resolucoesExercicio.length}/${testesExercicio.length}`);

      LogExecucao.create({...meta, resolucao: resolucaoObj, exercicio: exercicioObj});

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
