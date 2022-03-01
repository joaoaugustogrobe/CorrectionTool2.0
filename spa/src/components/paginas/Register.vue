<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Registrar como aluno</v-toolbar-title>
                <v-spacer />
                <v-icon>edit</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="Nome"
                    name="nome"
                    prepend-icon="person"
                    type="text"
                    v-model="nome"
                    :rules="[rules.required]"
                  />

                  <v-text-field
                    label="Email"
                    name="email"
                    prepend-icon="alternate_email"
                    type="email"
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                  />

                  <v-text-field
                    id="password"
                    label="Senha"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="senha1"
                    :error-messages="senhaErro"
                    :rules="[rules.required, rules.min]"
                  />

                  <v-text-field
                    id="password"
                    label="Confirme sua senha"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="senha2"
                    :error-messages="senhaErro"
                    :rules="[rules.required, rules.min, (senha2) => rules.senhasIguais(this.senha1, senha2)]"
                  />
                </v-form>

                <a @click="$router.push('login')">Já possui uma conta ? Logue-se!</a>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :loading="submetendo" color="primary" @click="logar">Registrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";
import backend from "../../backend";
export default {
  data() {
    return {
      nome: "",
      senha1: "",
      senha2: "",
      email: "",
      submetendo: false,
      senhaErro: null,
      rules: {
        required: value => !!value || "Obrigatório.",
        min: v => {
          this.senhaErro = null; //Limpa mensagem de erro de senha incorreta vinda da submissão
          return v.length >= 8 || "Min 8 caracteres";
        },
        senhasIguais: (senha1, senha2) =>
          senha1 === senha2 || "As senhas são diferentes.",
        email: v => /.+@.+\..+/.test(v) || "E-mail inválido"
      }
    };
  },
  methods: {
    logar() {
      if (!this.$refs.form.validate()) return;
      this.submetendo = true;
      let user = { email: this.email, password: this.senha1, nome: this.nome };

      axios
        .post(`${backend.uri}/aluno/create`, user)
        .then(res => {
          let authUser = res.data.data.user;
          window.localStorage.setItem("user", JSON.stringify(authUser));
          this.$cookie.set("x-access-token", res.data.data.token, {
            expires: "1Y"
          });
          this.$emit("login-status");
          this.$router.push("aluno");
          this.$store.commit("core/showMessage", {
            content: "Bem vindo!",
            error: false
          });
          this.$store.commit("core/set", {user: authUser});
        })
        .catch(e => {
          /* eslint-disable no-console */
          console.dir(e);
          /* eslint-enable no-console */
          if (e.response.status == 401) {
            this.$store.commit("core/showMessage", {
              content: e.response.data.message,
              error: true
            });
          }else{
            this.$store.commit("core/showMessage", {
              content: "Não foi possivel registrar este usuario. Tente novamente mais tarde ou entre em contato conosco.",
              error: true
            });
          }
        })
        .finally(() => {
          this.submetendo = false;
        });
    }
  }
};
</script>