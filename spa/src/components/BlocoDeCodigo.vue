<template>
  <div class="submissao">
    <p
      v-for="(linha, i) in codigoLinhas"
      v-html="linha"
      :key="i"
    />
  </div>
</template>

<script>
import { butify } from "../util/beautifier";

export default {
  data() {
    return {
      butify
    }
  },
  props: {
    codigo: {
      type: String,
      default: "",
    },
  },
  computed: {
    codigoLinhas() {
      let html = this.butify(this.codigo, {});
      let t = html.split(/<br \/>/gm);
      return t;
    },
  },
};
</script>

<style lang="scss" scoped>
.submissao {
  comm {
    color: #070;
  }
  func {
    color: #24b;
    font-weight: bold;
  }
  num {
    color: #d33;
  }
  end {
    color: #24b;
    font-weight: bold;
  }
  str {
    color: #83c;
  }
  err {
    background-color: #fcc;
  }

  height: auto;
  overflow-y: scroll;
  padding: 1rem 0;
  background-color: #f6f6f6;
  p {
    margin-bottom: 0;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    white-space: nowrap;

    &:hover {
      background-color: #efefef;
      cursor: pointer;
    }

    &:after {
      content: attr(data-comentario);
      font-size: 11px;
      line-height: 12px;
      width: 100%;
      text-align: end;
      padding-left: 6px;
      color: #070;
    }
  }
}
.v-card__text .submissao {
  height: unset;
  p:hover {
    background-color: #f6f6f6;
    cursor: unset;
  }
  p.highlight {
    background-color: #efefef;
  }
}
</style>