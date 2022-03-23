<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Esqueci minha senha</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
									<h3>Digite seu email para comecar o processo de redefinição de senha.</h3>
									<v-spacer />
                  <v-text-field
                    label="Email"
                    name="email"
                    prepend-icon="alternate_email"
                    type="email"
                    v-model="form.email"
                    :rules="[rules.required, rules.email]"
                  />
                </v-form>

                <a @click="$router.push('login')"
                  >Lembrou sua senha ? Logue-se!</a
                >
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :loading="loading" color="primary" @click="onRedefinirSenha"
                  >Redefinir senha</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import inputMixin from "../../util/inputs"

export default {
  mixins: [inputMixin],
  data() {
    return {
      form: {},
      senhaErro: "",
    };
  },
	methods: {
		onRedefinirSenha(){
			if(this.$refs.form.validate())
				this.$store.dispatch('aluno/forgotPassword', this.form.email);
		}
	},
	computed: {
		loading() {
      return this.$store.state.loading["aluno/forgotPassword"];
    },
	}
};
</script>

<style>
</style>