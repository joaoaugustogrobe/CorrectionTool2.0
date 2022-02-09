const Resolucao = require('./Gates/ResolucaoGate');
const Correcao = require('./Gates/CorrecaoGate');
const Exercicio = require('./Gates/ExercicioGate');
const Comentario = require('./Gates/ComentarioGate');
const Matricula = require('./Gates/MatriculaGate');

const modulos = {
    resolucao: Resolucao,
    exercicio: Exercicio,
    correcao: Correcao,
    comentario: Comentario,
    matricula: Matricula,
}

class Guard{
    static can(permissao, payload){
        const [modulo, tipo] = permissao.toLowerCase().split('/');

        // !! - previne dataleak do Guard, força retornar apenas true/false
        return !!modulos[modulo][tipo](payload) == true;
    }

    static cannot(permissao, payload){
        return !this.can(permissao, payload);
    }
}

module.exports = Guard