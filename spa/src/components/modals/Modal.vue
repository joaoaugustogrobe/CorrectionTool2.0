<template>
  <vue-modal
    :name="name"
    @before-open="beforeOpen"
    @before-close="beforeClose"
    @opened="opened"
    @closed="$emit('closed', $event)"
    :class="className"
    class="left-tabbed-modal"
    v-bind="{ ...$props, ...$attrs }"
    width="1000px"
    height="95%"
  >
    <div class="modal-tabs" v-if="!isMobile && hasTabs">
      <slot name="tabs"></slot>
    </div>
    <div class="modal-body-wrapper" :class="{['no-tabs']: !hasTabs}">
      <div class="modal-header">
        <h4>{{ title }}</h4>
        <v-icon @click="close">fa-times</v-icon>
      </div>
      <div class="modal-subheader">
        <slot name="subheader" />
      </div>
      <div class="modal-toaster"></div>

      <div class="modal-tabs" v-if="isMobile">
        <slot name="tabs"></slot>
      </div>

      <div
        class="modal-body"
        :class="{ [`no-padding`]: theme === `noPadding` }"
      >
        <slot name="body"></slot>
      </div>
    </div>
  </vue-modal>
</template>
<script>
export default {
  name: "Modal",
  props: {
    name: {
      type: String,
      default: "",
    },
    full: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "",
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    isMobile() {
      return false;
      return this.$store.state.core.isMobile;
    },
    hasTabs() {
      return !!this.$scopedSlots['tabs'];
    }
  },
  methods: {
    close: function () {
      this.$modal.hide(this.name);
    },
    opened: function () {
      this.$emit("opened", null);
    },
    beforeOpen: function (e) {
      this.$emit("before-open", e);
    },
    beforeClose: function (e) {
      this.$emit("before-close", e);
    },
  },
  components: {},
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/main.sass";

.left-tabbed-modal {
  .vm--modal {
    display: flex;
    height: 95vh !important;
    // width: auto !important;
    // max-width: 95vw;
    width: 1000px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    .modal-tabs {
      height: 100%;
      max-width: 25%;
      min-width: 250px;
      background-color: var(--bg-medium);
      padding: 20px 28px;
      border-radius: 10px 0 0 10px;
      border-right: 1px solid var(--border-color);

      ul {
        padding: 0;
        li {
          list-style: none;
          font-size: 16px;
          color: var(--text-medium);
          cursor: pointer;
          user-select: none;
          line-height: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .v-icon {
            font-size: 16px;
            width: 24px;
            text-align: center;
            margin-right: 6px;
            padding: 10px 0;
            color: var(--text-light);
          }

          &.item-title {
            cursor: unset;
            font-size: 12px;
            color: var(--text-light);
            &:first-child {
              padding-top: 0;
            }
          }

          &.active {
            color: var(--color-primary);
            font-weight: bold;
            .v-icon {
              color: var(--color-primary);
            }
          }
        }
      }
    }
    .modal-body-wrapper {
      height: 100%;
      width: 750px;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 0 10px 10px 0;
      background-color: var(--bg-light);

      &.no-tabs{
        width: 1000px;
      }

      .modal-header {
        background-color: var(--bg-light);
        padding: 10px 20px;
        display: flex;

        justify-content: space-between;
        
        h4 {
          color: var(--text-dark);
          font-weight: 500;
          font-size: 1.5rem;
        }

        .v-icon{
          font-weight: normal;
        }


      }
      .modal-subheader {
        display: flex;

        > div {
          //portal target
          width: 100%;
          > div {
            width: 100%;
            padding: 0 20px 10px 20px;
          }
        }

        .form-group {
          width: 50%;
        }
      }
      .modal-body {
        border-top: 1px solid var(--border-color);
        overflow-y: auto;
        padding: 20px;

        .section{
          .section-title{
            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
            margin-bottom: 18px;
          }
        }
      }
      .modal-toaster {
        padding: 0;
        position: relative;
        .vue-portal-target {
          width: 100%;
          .toast-wrapper {
            position: unset;
          }
        }
      }
    }
  }
}
</style>