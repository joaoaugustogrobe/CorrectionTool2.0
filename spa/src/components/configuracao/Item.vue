<template>
  <div>
    <div class="configuracao-item-header" :class="{ textfield: textfield, descricao: descricao }">
      <label :for="id">{{ label }}</label>
    </div>
    <div class="configuracao-item-body" :class="{ textfield: textfield, descricao: descricao }">
      <div class="configuracao-item-conteudo">
        <span class="configuracao-item-descricao" v-if="descricao">{{
          descricao
        }}</span>
        <v-text-field
          class="text-field"
          v-if="textfield"
          outlined
          :loading="loading"
          dense
          :id="id"
          :value="value"
          :disabled="disabled"
          @input="(e) => $emit('input', e)"
          :rules="rules"
        />
        <slot />
      </div>
      <v-switch
        v-if="hasSwitch"
        :id="id"
        :loading="loading"
        @change="(e) => $emit('input', !!e)"
        :value="value"
        :disabled="disabled"
      ></v-switch>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid";

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      default: "",
    },
    textfield: {
      type: Boolean,
      default: false,
    },
    hasSwitch: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Boolean],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      id: uuid(),
    };
  },
};
</script>

<style scoped lang="scss">
.configuracao-item-header {
  label {
    display: block;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 2px;
  }
  &.textfield label, &.descricao label{
    margin-bottom: 0px;
  }
}
.configuracao-item-body {
  display: flex;
  justify-content: space-between;
  .configuracao-item-conteudo {
    width: 100%;
    .text-field {
      margin-top: 6px;
    }
    .configuracao-item-descricao {
      font-size: 0.8rem;
      line-height: 0.9rem;
      color: var(--text-muted);
      height: fit-content;
      padding-right: 2rem;
    }
  }
  &.textfield, &.descricao {
    margin-top: -2px;
  }
}
::v-deep.v-input--switch {
  margin-top: -9px;
  display: flex;
  align-items: center;
  .v-input__slot {
    margin: 0;
  }
  .v-messages {
    display: none;
  }
}
</style>