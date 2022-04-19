const { body } = require('express-validator');

const Exercicio = require('../models/Exercicio');
const Teste = require('../models/Teste');
const Aluno = require('../models/Aluno');
const TesteResolucao = require('../models/TesteResolucao');

let schemas = {};

schemas['POST/exercicio/salvar'] = {
	exercicioId: {
		custom: {
			options: async (value, { req, location, path }) => {
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

schemas['POST/exercicio/create'] = {
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
				return value && !!String(value).match(/^[0-9]{13}$/); //13 char unix timestamp
			}
		},
	},
	visivel: {
		isBoolean: {
			errorMessage: 'Visivel deve ser verdadeiro ou falso',
		},
		toBoolean: true,
	},
	nomeFuncao: {
		custom: {
			errorMessage: 'Nome inválido para função',
			options: (value) => /^[a-zA-Z_$][a-zA-Z_$0-9]{2,30}$/.test(value)
		},
	},
	assinatura: {
		custom: {
			errorMessage: 'Assinatura da função inválida',
			options: (value) => {
				if (typeof (value) !== 'object' || !value.length) return false;
				if (value.some(arg => {
					return !/^[a-zA-Z_$][a-zA-Z_$0-9]{0,30}$/.test(arg); //0 até 30 chars
				})) return false;
				return true;
			}
		}
	}
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

schemas['POST/testes/salvar'] = {
	testeId: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Teste.findById(value).then(teste => {
					if (!teste) {
						return Promise.reject('Teste não existe');
					}
				});
			},
		},
	},
	isPrivate: {
		isBoolean: {
			errorMessage: 'Visivel deve ser verdadeiro ou falso',
		},
		toBoolean: true,
	},
	nome: {
		isLength: {
			errorMessage: 'Título deve conter ao menos 6 caracteres',
			options: { min: 6 },
		},
	},
	mensagemErro: {
		custom: {
			options: (value, { req, location, path }) => {
				if (typeof (value) !== 'string') throw new Error('Mensagem de erro inválida');
				return true;
			},
		},
		isLength: {
			errorMessage: 'Mensagem de erro deve conter ao menos 6 caracteres',
			options: { min: 6 },
		},
	},
	output: {
		isLength: {
			errorMessage: 'Output é obrigatório',
			options: { min: 0 },
		},
	},
	input: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Teste.findById(req.body.testeId).populate('exercicio').then(teste => {
					if (!teste)
						return Promise.reject('Teste não existe');

					console.log("TESTE", teste);


					if (typeof (value) !== 'object' || value.length !== teste.exercicio.assinatura.length) return Promise.reject('Input inválido');

					if (value.some(input => {
						return typeof (input) !== 'string' || !input.length
					})) return Promise.reject('Input inválido');
					return true;
				});
			},
		},
	}

};

schemas['POST/testes/create'] = {
	exercicioId: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Exercicio.findById(value).then(exercicio => {
					if (!exercicio) {
						return Promise.reject('Exercicio não existe');
					}
				});
			},
		},
	},
	isPrivate: {
		isBoolean: {
			errorMessage: 'Visivel deve ser verdadeiro ou falso',
		},
		toBoolean: true,
	},
	nome: {
		isLength: {
			errorMessage: 'Título deve conter ao menos 6 caracteres',
			options: { min: 6 },
		},
	},
	mensagemErro: {
		custom: {
			options: (value, { req, location, path }) => {
				if (typeof (value) !== 'string') throw new Error('Mensagem de erro inválida');
				return true;
			},
		},
		isLength: {
			errorMessage: 'Mensagem de erro deve conter ao menos 6 caracteres',
			options: { min: 6 },
		},
	},
	output: {
		isLength: {
			errorMessage: 'Output é obrigatório',
			options: { min: 0 },
		},
	},
	input: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Exercicio.findById(req.body.exercicioId).then(exercicio => {
					if (!exercicio)
						return Promise.reject('Exercicio não existe');

					console.log("Validando input:", req.body.exercicioId, exercicio)


					if (typeof (value) !== 'object' || value.length !== exercicio.assinatura.length) return Promise.reject('Input inválido');

					if (value.some(input => {
						return typeof (input) !== 'string' || !input.length
					})) return Promise.reject('Input inválido');
					return true;
				});
			},
		},
	}

};

schemas['POST/testes/deletar'] = {
	testeId: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Teste.findById(value).then(teste => {
					if (!teste) {
						return Promise.reject('Teste não existe');
					}
				});
			},
		},
	},
};

schemas['POST/testeResolucao/salvar'] = {
	testeResolucaoId: {
		custom: {
			options: async (value, { req, location, path }) => {
				return TesteResolucao.findById(value).then(teste => {
					if (!teste) {
						return Promise.reject('TesteResolucao não existe');
					}
				});
			},
		},
	},
	isError: {
		isBoolean: {
			errorMessage: 'isError inválido',
		},
		toBoolean: true,
	}
};

schemas['POST/aluno/forgot_password'] = {
	email: {
		isEmail: {
			errorMessage: "Email inválido",
		},
	}
}

schemas['POST/aluno/reset_password'] = {
	alunoId: {
		custom: {
			options: async (value, { req, location, path }) => {
				return Aluno.findById(value).then(aluno => {
					if (!aluno) {
						return Promise.reject('Aluno não existe');
					}
				});
			},
		},
	},
	token: {
		isHexadecimal: {
			errorMessage: "Token inválido",
		},
		isLength: {
			errorMessage: "Token inválido",
			options: {min: 40, max: 40}
		}
	},
	password: {
		isLength: {
			errorMessage: "Password inválido",
			options: {min: 6}
		}
	}
}

schemas['POST/admin/login'] = {
	email: {
		isEmail: {
			errorMessage: "Email inválido",
		},
	},
	password: {
		isLength: {
			errorMessage: "Password inválido",
			options: {min: 12}
		}
	}
}

schemas['POST/admin/create'] = {
	email: {
		isEmail: {
			errorMessage: "Email inválido",
		},
	},
	password: {
		isLength: {
			errorMessage: "Password inválido",
			options: {min: 12}
		}
	}
}


schemas['POST/professor/create'] = {
	email: {
		isEmail: {
			errorMessage: "Email inválido",
		},
	},
	nome: {
		isLength: {
			errorMessage: 'Título deve conter ao menos 3 caracteres',
			options: { min: 3 },
		},
	},
	password: {
		isLength: {
			errorMessage: "Password deve conter ao menos 8 caracteres",
			options: {min: 8}
		}
	}
}

module.exports = schemas;

