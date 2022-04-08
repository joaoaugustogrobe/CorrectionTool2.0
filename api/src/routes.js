require('dotenv').config();
const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const { checkSchema, validationResult } = require('express-validator');
const { validate } = require('./Validation/index.js');
const schemas = require('./Validation/schemas');



const AlunoController = require('./controllers/AlunoController');
const ProfessorController = require('./controllers/ProfessorController');
const AdminController = require('./controllers/AdminController');
const MateriaController = require('./controllers/MateriaController');
const MatriculaController = require('./controllers/MatriculaController');
const ExercicioController = require('./controllers/ExercicioController');
const SessionController = require('./controllers/SessionController');
const ResolucaoController = require('./controllers/ResolucaoController');
const TesteController = require('./controllers/TesteController');
const DockerController = require('./controllers/DockerController');
const ResolucaoTesteController = require('./controllers/ResolucaoTesteController');
const CorrecaoController = require('./controllers/CorrecaoController');
const TesteResolucaoController = require('./controllers/TesteResolucaoController');

const routes = express.Router();
const upload = multer(uploadConfig);

//Professor
routes.post('/professor/login', ProfessorController.authenticate);

//Admin
routes.post('/admin/create', checkSchema(schemas['POST/admin/create']), AdminController.store);
routes.post('/admin/login', checkSchema(schemas['POST/admin/login']), AdminController.authenticate);

//Aluno
routes.post('/aluno/login', AlunoController.authenticate);
routes.post('/aluno/create', AlunoController.store);

routes.post('/aluno/forgot_password', checkSchema(schemas['POST/aluno/forgot_password']), AlunoController.esqueciMinhaSenha);
routes.post('/aluno/reset_password', checkSchema(schemas['POST/aluno/reset_password']), AlunoController.redefinirSenha);

//Materias
routes.post('/materia/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), MateriaController.store);
routes.get('/:materiaId/alunos', (req, res, next) => SessionController.validar(req, res, next, "professor"), MateriaController.obterAlunosMatriculados);
routes.get('/materia/:materiaId/show', (req, res, next) => SessionController.validar(req, res, next), MateriaController.show);
routes.get('/materia', (req, res, next) => SessionController.validar(req, res, next), MateriaController.index);
routes.post('/materia/salvar', (req, res, next) => SessionController.validar(req, res, next, "professor"), MateriaController.salvar);

//Matricula
routes.get('/matricula', (req, res, next) => SessionController.validar(req, res, next, "aluno"), MatriculaController.obterMatriculasAluno);
routes.post('/matricula/create', (req, res, next) => SessionController.validar(req, res, next, "aluno"), MatriculaController.store);
routes.post('/matricula/deletar', (req, res, next) => SessionController.validar(req, res, next), MatriculaController.cancelarMatricula)


routes.post('/exercicio/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/exercicio/create']), ExercicioController.store);
routes.get('/exercicios/', (req, res, next) => SessionController.validar(req, res, next, "professor"), ExercicioController.getExerciciosProfessor);
routes.get('/exercicio/show/all', (req, res, next) => SessionController.validar(req, res, next, "aluno"), ExercicioController.getExerciciosAluno);
routes.get('/exercicio/show/:materiaId', (req, res, next) => SessionController.validar(req, res, next), ExercicioController.getExerciciosMateria);
routes.get('/:exercicioId/show/', validate, (req, res, next) => SessionController.validar(req, res, next, "professor"), ExercicioController.exercicioShow);
routes.get('/exercicio/notas/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "professor"), ResolucaoTesteController.ObterNotasExercicio);
routes.post('/exercicio/salvar', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/exercicio/salvar']), ExercicioController.salvar);

routes.post('/resolucao/submit', upload.single('arquivoResolucao'), (req, res, next) => SessionController.validar(req, res, next, "aluno"), ResolucaoController.store);
routes.get('/resolucoes/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "professor"), ResolucaoController.obterResolucoesDeExercicio);
routes.get('/resolucao/:exercicioId', (req, res, next) => SessionController.validar(req, res, next, "aluno"), ResolucaoController.obterResolucaoDeExercicio);
routes.get('/resolucao/:resolucaoId/download', (req, res, next) => SessionController.validar(req, res, next), ResolucaoController.download);

//Testes
routes.post('/testes/create', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/testes/create']), TesteController.store);
routes.get('/exercicio/:exercicioId/testes', (req, res, next) => SessionController.validar(req, res, next), TesteController.getTestesExercicio);
routes.post('/testes/salvar', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/testes/salvar']), TesteController.salvar);
routes.post('/testes/deletar', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/testes/deletar']), TesteController.deletar);

//ResolucaoTeste
routes.get('/resolucao/testes/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next), ResolucaoTesteController.obterNotasResolucao);

//Correcao
routes.post('/correcao/linefeedback/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.salvarFeedbackLinha);
routes.post('/correcao/feedback/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.salvarFeedback);
routes.get('/correcao/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next), CorrecaoController.obterCorrecao);

routes.post('/correcao/create/:resolucaoId', (req, res, next) => SessionController.validar(req, res, next, "professor"), CorrecaoController.store);

routes.post('/testeresolucao/salvar', (req, res, next) => SessionController.validar(req, res, next, "professor"), checkSchema(schemas['POST/testeResolucao/salvar']), TesteResolucaoController.salvarEstadoErro);


routes.post('/docker', DockerController.containerCallback);

module.exports = routes;
