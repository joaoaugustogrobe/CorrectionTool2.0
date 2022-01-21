require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');


const AlunoController = require('./controllers/AlunoController');
const ProfessorController = require('./controllers/ProfessorController');
const MateriaController = require('./controllers/MateriaController');
const MatriculaController = require('./controllers/MatriculaController');
const ExercicioController = require('./controllers/ExercicioController');
const SessionController = require('./controllers/SessionController');
const ResolucaoController = require('./controllers/ResolucaoController');
const TesteController = require('./controllers/TesteController');
const DockerController = require('./controllers/DockerController');
const ResolucaoTesteController = require('./controllers/ResolucaoTesteController');
const CorrecaoController = require('./controllers/CorrecaoController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Professor
routes.post('/professor/login', ProfessorController.authenticate)

//Aluno
routes.post('/aluno/login', AlunoController.authenticate)
routes.post('/aluno/create', AlunoController.store)

//Materias
routes.post('/materia/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), MateriaController.store);
routes.get('/:materiaId/alunos', (req, res, next) => SessionController.validar(req, res, next, "professor"), MateriaController.obterAlunosMatriculados);
routes.get('/materia/:materiaId/show', (req, res, next) => SessionController.validar(req, res, next), MateriaController.show);
routes.get('/materia', (req, res, next) => SessionController.validar(req, res, next), MateriaController.index);

routes.get('/matricula', (req, res, next) => SessionController.validar(req, res, next, "aluno"), MatriculaController.obterMatriculasAluno);
routes.post('/matricula/create', (req, res, next) => SessionController.validar(req, res, next, "aluno"), MatriculaController.store);

routes.post('/exercicio/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), ExercicioController.store);
routes.get('/exercicios/', (req, res, next) => SessionController.validar(req, res, next, "professor"), ExercicioController.getExerciciosProfessor);
routes.get('/exercicio/show/all', (req, res, next) => SessionController.validar(req, res, next, "aluno"), ExercicioController.getExerciciosAluno);
routes.get('/exercicio/show/:materiaId', (req, res, next) => SessionController.validar(req, res, next), ExercicioController.getExerciciosMateria);
routes.get('/:exercicioId/show/', (req, res, next) => SessionController.validar(req, res, next, "professor"), ExercicioController.exercicioShow);
routes.get('/exercicio/notas/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "professor"), ResolucaoTesteController.ObterNotasExercicio);



routes.post('/resolucao/submit', upload.single('arquivoResolucao'), (req, res, next) => SessionController.validar(req, res, next, "aluno"), ResolucaoController.store);
routes.get('/resolucoes/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "professor"), ResolucaoController.obterResolucoesDeExercicio);
routes.get('/resolucao/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "aluno"), ResolucaoController.obterResolucaoDeExercicio);
routes.get('/resolucao/:resolucaoId/download', (req, res, next) => SessionController.validar(req, res, next), ResolucaoController.download);

//Testes
routes.post('/testes/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), TesteController.store);
routes.get('/exercicio/:exercicioId/testes', (req, res, next) => SessionController.validar(req, res, next), TesteController.getTestesExercicio);

//ResolucaoTeste
routes.get('/resolucao/testes/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), ResolucaoTesteController.obterNotasResolucao);

//Correcao
routes.post('/correcao/linefeedback/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.salvarFeedbackLinha);
routes.post('/correcao/feedback/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.salvarFeedback);
routes.get('/correcao/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.obterCorrecao);

routes.post('/correcao/create/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.store);




routes.post('/docker', DockerController.containerCallback);


module.exports = routes;
