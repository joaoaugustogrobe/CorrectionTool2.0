<template>
  <v-app class="grey lighten-4">
    <BarraNotificacao />
    <Navbar
      :user="user"
      v-if="autenticado != 'convidado'"
      v-on:login-status="checarAutenticacao"
    />
    <v-content class="px4 pb-4 grey lighten-4">
      <router-view v-on:login-status="checarAutenticacao"></router-view>
    </v-content>
    <AlterarExercicio />
  </v-app>
</template>

<script>
import Navbar from "./components/template/Navbar";
import BarraNotificacao from "./components/template/BarraNotificacao";
import AlterarExercicio from "./components/modals/AlterarExercicio.vue";

export default {
  name: "App",
  components: {
    Navbar,
    BarraNotificacao,
    AlterarExercicio,
  },

  data: () => ({
    autenticado: "convidado",
    user: {
      nome: "João Augusto",
      gravatarUrl: "",
    },
  }),
  methods: {
    checarAutenticacao() {
      let token = this.$cookie.get("x-access-token");
      if (!token) this.autenticado = "convidado";
      else {
        this.user = JSON.parse(window.localStorage.getItem("user"));
        if (this.user) this.autenticado = this.user.role;
        else this.autenticado == "convidado";
      }
    },
  },
  created() {
    this.checarAutenticacao();
    if (
      this.$router.currentRoute.name == null ||
      !this.$router.resolve(this.$router.currentRoute.name)
    )
      this.$router.push("login");
      this.$store.dispatch('professor/init');
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/main.sass'
</style>