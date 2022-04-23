<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Logar como {{role}}</v-toolbar-title>
                <v-spacer />
                <v-icon v-if="role == 'professor'">school</v-icon>
                <v-icon v-if="role == 'aluno'">edit</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="person"
                    type="text"
                    v-model="login"
                    :rules="[rules.required]"
                  />

                  <v-text-field
                    id="password"
                    label="Senha"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="senha"
                    :error-messages="senhaErro"
                    :rules="[rules.required, rules.min]"
                  />
                </v-form>

                <a v-if="role == 'aluno'" @click="role = 'professor'">Quero me logar como professor</a>
                <a v-if="role == 'professor'" @click="role = 'aluno'">Quero me logar como aluno</a>
                <v-spacer></v-spacer>
                <a @click="$router.push('register')">Não possui uma conta ? Registre-se!</a>
                <v-spacer></v-spacer>
                <a @click="$router.push('forgot_password')">Esqueci minha senha</a>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn :loading="submetendo" color="primary" @click="logar">Login</v-btn>
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
      login: "",
      senha: "",
      role: "professor",
      submetendo: false,
      senhaErro: null,
      rules: {
        required: value => !!value || "Obrigatório.",
        min: v => {
          this.senhaErro = null; //Limpa mensagem de erro de senha incorreta vinda da submissão
          return v.length >= 8 || "Min 8 caracteres";
        }
      }
    };
  },
  methods: {
    logar() {
      if (!this.$refs.form.validate()) return;
      this.submetendo = true;
      let user = { email: this.login, password: this.senha };

      axios
        .post(`${backend.uri}/${this.role}/login`, user)
        .then(res => {
          let authUser = res.data.data.user;
          window.localStorage.setItem("user", JSON.stringify(authUser));
          this.$cookie.set("x-access-token", res.data.data.token, {
            expires: "1Y"
          });
          this.$emit("login-status");
          this.$store.commit("core/showMessage", {
            content: "Login efetuado com sucesso!",
            error: false
          });
          this.$store.commit("core/set", {user: authUser});
          if (this.role == "professor") this.$router.push("exercicios");
          else this.$router.push("aluno");
        })
        .catch(e => {
          this.senhaErro = e.response?.data?.message;
          this.$store.commit("core/showMessage", {
            content: "Não foi possivel efetuar o login!",
            error: true
          });
        })
        .finally(() => {
          this.submetendo = false;
        });
    }
  }
};
</script>