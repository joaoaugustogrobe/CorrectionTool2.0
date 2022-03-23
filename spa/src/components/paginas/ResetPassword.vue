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
                <v-icon>edit</v-icon>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <h3>Prontinho, agora basta definir sua nova senha.</h3>
                  <v-spacer />
                  <v-text-field
                    id="password"
                    label="Senha"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="form.password"
                    :error-messages="senhaErro"
                    :rules="[rules.required, rules.min]"
                  />

                  <v-text-field
                    id="password"
                    label="Confirme sua senha"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                    v-model="form.password2"
                    :error-messages="senhaErro"
                    :rules="[
                      rules.required,
                      rules.min,
                      () => rules.senhasIguais(form.password, form.password2),
                    ]"
                  />
                </v-form>

                <a @click="$router.push('login')"
                  >Lembrou sua senha ? Logue-se!</a
                >
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :loading="loading"
                  color="primary"
                  @click="onRedefinirSenha"
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
import inputMixin from "../../util/inputs";

export default {
  mixins: [inputMixin],
  data() {
    return {
      form: {},
      senhaErro: "",
    };
  },
  methods: {
    async onRedefinirSenha() {
      if(this.$refs.form.validate()){
        const req = await this.$store.dispatch("aluno/resetPassword", { ...this.form, token:this.token, alunoId:this.id });
        if(req.ok) this.$router.push('login');
      }
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading["aluno/resetPassword"];
    },
    token() {
      return this.$route.query.token;
    },
    id() {
      return this.$route.query.id;
    },
  },
};
</script>

<style>
</style>