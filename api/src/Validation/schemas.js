const { body } = require('express-validator');

const Exercicio = require('../models/Exercicio');

let schemas = {};

schemas['POST/exercicio/salvar'] = {
	exercicioId: {
		custom: {
			options: async (value, { req, location, path }) => {
				console.log('validating id', value);
				return Exercicio.findById(value).then(exercicio => {
					if (!exercicio) {
						return Promise.reject('Exercicio não existe');
					}
				});
			},
		},
	},
	titulo: {
		isLength: {
			errorMessage: 'Título deve conter ao menos 6 caracteres',
			options: { min: 6 },
		},
	},
	descricao: {
		isLength: {
			errorMessage: 'Descrição é obrigatória',
			options: { min: 1 },
		},
	},
	prazo: {
		custom: {
			errorMessage: 'Prazo inválido',
			options: (value) => {
				return !!value.match(/^[0-9]{13}$/); //13 char unix timestamp
			}
		},
	},
	visivel: {
		isBoolean: {
			errorMessage: 'Visivel deve ser verdadeiro ou falso',
		},
		toBoolean: true,
	},
}

schemas['GET/:exercicioId/show/'] = {
	exercicioId: {
		// The location of the field, can be one or more of body, cookies, headers, params or query.
		// If omitted, all request locations will be checked
		in: ['params', 'query'],
		errorMessage: 'ID is wrong',
		isInt: true,
		// Sanitizers can go here as well
		toInt: true,
	},
	foo: {
		// The location of the field, can be one or more of body, cookies, headers, params or query.
		// If omitted, all request locations will be checked
		in: ['body'],
		errorMessage: 'ID is wrong',
		isInt: true,
		// Sanitizers can go here as well
		toInt: true,
	},
	myCustomField: {
		// Custom validators
		custom: {
			options: (value, { req, location, path }) => {
				return value + req.body.foo + location + path;
			},
		},
		// and sanitizers
		customSanitizer: {
			options: (value, { req, location, path }) => {
				let sanitizedValue;

				if (req.body.foo && location && path) {
					sanitizedValue = parseInt(value);
				} else {
					sanitizedValue = 0;
				}

				return sanitizedValue;
			},
		},
	},
}

module.exports = schemas;

