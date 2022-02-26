<template>
  <div>
    <BlocoDeCodigo :codigo="template" />
    <a
			class="float-right my-2"
      @click="onDownloadTemplate"
    >
      Download
    </a>
  </div>
</template>

<script>
import BlocoDeCodigo from "../BlocoDeCodigo.vue";
export default {
  components: {
    BlocoDeCodigo,
  },
	props: {
		exercicio: {
			type: Object,
			required: true,
		},
		assinaturaFuncao: {
			type: Array,
			required: true
		},
	},
	computed: {
    template() {
      const parametros = this.assinaturaFuncao.reduce((anterior, input) => {
        return anterior ? `${anterior}, ${input}` : input;
      }, "");

      const assinatura = `${this.exercicio.nomeFuncao}(${parametros})`;
      return `%${this.exercicio.titulo ? this.exercicio.titulo : "$exercicioTitulo"}
%${
  this.exercicio.descricao
    ? this.exercicio.descricao.replaceAll('\n', '\n%')
    : "$exercicioDescricao"
}

function y = ${assinatura}

end`;
    },
	},
	methods: {
		onDownloadTemplate() {
			this.$store.dispatch('comum/downloadTemplate', {template: this.template, filename: this.exercicio.nomeFuncao});
		}
	}
};
</script>

<style>
</style>