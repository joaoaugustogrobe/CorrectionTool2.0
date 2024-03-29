
export const inputMixin = {
	data() {
		return {
			rules: {
				min: (v = '', length = 6) => v.length >= length || `Campo inválido. Minímo de ${length} caracteres`,
				nomeFuncao: (v) => /^[a-zA-Z_$][a-zA-Z_$0-9]{2,30}$/.test(v) || "Função inválida",
				funcaoArgumento: (v) => /^[a-zA-Z_$][a-zA-Z_$0-9]{0,30}$/.test(v) || "Argumento inválido",
				required: (value) => !!value || "Este campo é brigatório.",
				unixTimestamp: (value = '') => !!String(value).match(/^[0-9]{13}$/) || "Data inválida",
				assinaturaFuncao: (value = []) => {
					if (typeof (value) !== 'object' || !value.length) return 'Requer ao menos um argumento';
					return true;
				},
				senhasIguais: (senha1, senha2) => senha1 === senha2 || "As senhas devem ser iguais.",
				email: v => /.+@.+\..+/.test(v) || "E-mail inválido",
				fileSize: files => {
					if (!files) return "Arquivo inválido";
					const file = files.length ? files[0] : files;
					const size = file.size / 1024 / 1024;
					return size <= 1 || `Arquivo muito grande. Tamanho máximo: 1MB. Tamanho atual: ${size.toFixed(2)}MB`;
				}
			},
		}
	}
}
export default inputMixin;