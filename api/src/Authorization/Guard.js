const Resolucao = require('./Gates/ResolucaoGate');
const Correcao = require('./Gates/CorrecaoGate');
const Exercicio = require('./Gates/ExercicioGate');
const Comentario = require('./Gates/ComentarioGate');
const Materia = require('./Gates/MateriaGate');
const Matricula = require('./Gates/MatriculaGate');
const Teste = require('./Gates/TesteGate');
const TesteResolucao = require('./Gates/TesteResolucaoGate');

const modulos = {
    resolucao: Resolucao,
    exercicio: Exercicio,
    correcao: Correcao,
    comentario: Comentario,
    materia: Materia,
    matricula: Matricula,
    teste: Teste,
    testeresolucao: TesteResolucao,
}

class Guard{
    static async can(permissao, payload){
        const [modulo, tipo] = permissao.toLowerCase().split('/');
        console.log(modulo, tipo)
        const can = await modulos[modulo][tipo](payload);

        // !! - previne dataleak do Guard, força retornar apenas true/false
        return !!can == true;
    }


    static async cannot(permissao, payload){
        const can = await this.can(permissao, payload);;
        return !can;
    }
}

module.exports = Guard