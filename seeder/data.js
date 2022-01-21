var faker = require('faker');
const { getObjectId } = require('mongo-seeding');


const fs = require('fs');

faker.locale = "pt_BR";


run();

//seed -u mongodb://127.0.0.1:27017/mongooseding_mongoose_express --drop-database ./data



async function run() {
    //alunos

    gerarAlunos();
    gerarProfessores();
    gerarMaterias();
    gerarExercicios();
    gerarTestes();
    gerarMatriculas();



}


function gerarAlunos() {
    let data = [];
    for (var i = 0; i < 300; i++) {
        data.push({
            _id: { "$oid": getObjectId(`aluno-${i}`) },
            email: `aluno${i}@demo.com`,
            nome: `aluno${i}`,
            password: 'demo1234'
        });
    }

    return fs.writeFileSync('./data/alunos.json', JSON.stringify(data));
}

function gerarProfessores() {
    let data = [];
    data.push({
        _id: { "$oid": getObjectId(`professor`) },
        email: `professor@demo.com`,
        nome: `professor`,
        password: 'demo1234'
    });

    return fs.writeFileSync('./data/professors.json', JSON.stringify(data));
}

function gerarMaterias() {
    let data = [];
    for (var i = 0; i < 3; i++) {

        data.push({
            _id: { "$oid": getObjectId(`materia-${i}`) },
            nome: `materia${i}`,
            password: 'demo1234',
            professor: { "$oid": getObjectId(`professor`) },
            lotacao: 0,
            capacidade: 25,
        });
    }

    return fs.writeFileSync('./data/materias.json', JSON.stringify(data));
}

function gerarExercicios() {
    let data = [];

    data.push({
        _id: { "$oid": getObjectId(`exercicio`) },
        linguagem: 'octave',
        nomeFuncao: 'DecomposicaoLU',
        status: 'pendente',
        titulo: `Decomposição LU`,
        descricao: `% DecomposicaoLU.m  é uma function que resolve um sistema  linear Ax=b
        % Entradas: A (matriz dos coeficientes)
        %           b (vetor de recursos)
        % Saida: x (solução do sistema linear) 
        
        function [A x] = DecomposicaoLUdefault(A,b)`,
        prazo: 1732970800000,
        nota: 10,
        materia: { "$oid": getObjectId(`materia-0`) },
    });



    return fs.writeFileSync('./data/exercicios.json', JSON.stringify(data));
}


function gerarTestes() {
    let data = [];

    data.push({
        _id: { "$oid": getObjectId(`teste-0`) },
        input: [
            "[0.18 0.23 0.67; 0.54 0.37 0.10; 0.28 0.40 0.23]",
            "[308 350 342]"
        ],
        isPrivate: false,
        output: "[0]",
        exercicio: { "$oid": getObjectId(`exercicio`) },
    });

    data.push({
        _id: { "$oid": getObjectId(`teste-1`) },
        input: [
            "[0 1 3;1 0 -2;3 0 1]",
            "[1; 1;2]"
        ],
        isPrivate: false,
        output: "[0]",
        exercicio: { "$oid": getObjectId(`exercicio`) },
    });


    data.push({
        _id: { "$oid": getObjectId(`teste-2`) },
        input: [
            "[0 1 3;1 0 -2;0 0 0]",
            "[1;1;2][-91 118 -82 10 157 143 -98 -52 124 -34 -87 98 189 61 -72 27 -42 -14 -157 -179 ; 98 -64 -52 -175 -10 -77 80 -119 -178 178 138 91 103 78 -127 50 -33 76 23 92 ; 197 68 140 -148 44 -136 -12 32 184 189 113 133 -71 100 -185 166 -89 -6 -63 166 ; 29 -84 138 -140 -190 84 -8 156 179 74 -200 111 180 -134 104 -150 -185 -146 -133 -21 ; -133 -199 34 -68 -35 -88 -48 -20 -120 -47 31 -179 74 -49 -107 -180 147 171 83 146 ; -137 -34 -167 51 -7 -150 -89 23 -149 128 10 9 25 138 85 -43 95 -133 69 -158 ; 26 192 -179 75 -106 -79 -145 -187 -88 189 -12 1 173 -189 -110 10 -149 5 121 -152 ; 36 72 -99 -75 -11 -134 -35 -188 -113 133 182 -155 49 -191 131 -109 -21 -188 -47 197 ; 3 72 82 -141 13 -102 192 -68 146 116 -50 149 123 -38 -150 171 -73 -74 -167 83 ; -118 193 -171 67 18 -91 -57 2 172 -105 -171 -20 62 -130 -156 -107 88 -48 -37 -51 ; -92 6 68 70 125 -33 183 -185 54 -155 191 129 -71 -147 -194 -70 -188 117 97 -127 ; -144 -119 -61 -10 -115 -3 78 12 8 5 -181 32 24 64 89 95 -71 138 -176 -34 ; 67 -109 -110 -94 -79 -183 -2 -76 151 -57 77 -157 167 -22 -187 -194 60 -174 104 -47 ; 195 -82 123 16 -18 172 151 -183 148 62 -108 41 117 55 104 -1 -166 -154 -89 -63 ; -26 104 -124 196 -179 137 -121 -182 102 -78 -62 -141 -57 -117 119 -148 33 -77 -18 37 ; 130 69 8 61 -183 70 10 129 138 -40 -64 103 -126 30 -102 -188 -55 93 -128 -184 ; -109 46 -81 6 -109 67 -116 -52 -51 166 149 28 -37 151 29 30 6 -75 -93 87 ; 2 129 77 196 159 26 -3 106 -119 -99 -23 -66 111 14 -106 -32 -40 -65 -74 -185 ; 199 97 -47 -139 -188 -152 197 -74 145 78 145 88 -105 -106 -140 58 56 7 110 -53 ; 183 -87 81 41 -117 -31 -82 -114 186 187 -6 -143 153 163 -115 -61 57 -198 -157 116 ],[-112 ; 110 ; 103 ; 114 ; 141 ; -175 ; 91 ; 113 ; 74 ; -38 ; 75 ; -126 ; 106 ; -193 ; 45 ; 145 ; -171 ; -153 ; -105 ; 90 ]"
        ],
        isPrivate: true,
        output: "[0]",
        exercicio: { "$oid": getObjectId(`exercicio`) },
    });


    return fs.writeFileSync('./data/testes.json', JSON.stringify(data));
}


function gerarMatriculas() {
    let data = [];
    for (var i = 0; i < 30; i++) {

        data.push({
            _id: { "$oid": getObjectId(`matricula-${i}`) },
            aluno: { "$oid": getObjectId(`aluno-${i}`) },
            materia: { "$oid": getObjectId(`materia-0`) },
        });
    }

    return fs.writeFileSync('./data/matriculas.json', JSON.stringify(data));
}