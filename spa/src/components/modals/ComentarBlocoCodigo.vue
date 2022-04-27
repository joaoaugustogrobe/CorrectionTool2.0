<template>
  <Modal name="comentar-bloco-codigo" title="Adicionar comentario" @before-open="onOpen">
    <template class="body" v-slot:body>
      <v-card>
        <v-cart-text>
          <div class="row">
            <div class="col-12">
              <div class="form-group">
                <label>Comentario</label>
                <v-text-input
                  class="form-control"
                  v-model="comentario"
                  rows="3"
                  placeholder="Digite seu comentario"
                ></v-text-input>
              </div>
            </div>
          </div>
        </v-cart-text>
      </v-card>
    </template>
  </Modal>
</template>

<script>
import Modal from '../modals/Modal.vue';
export default {
  data() {
    return {
      comentario: "",
      codigo: [],
      linha: '',
    };
  },
  components: {
    Modal,
  },
  methods: {
    onOpen({params}){
      console.log(params);
    }
  }
};
</script>

<style>
</style>