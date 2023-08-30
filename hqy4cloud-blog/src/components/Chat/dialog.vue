<template>
  <div class="messageBoxStyle" v-show="dialogTableVisible">
  <el-dialog :visible.sync="dialogIsShow" :modal="false" @close="closeDialog" custom-class="sideMenu-message"
        :show-close="false" :width="'1000px'" :close-on-press-escape="true" >
      <IM class="im-dialog" :dialog="dialogIsShow"  @newChat="contactSync" @close="closeDialog"></IM>
    </el-dialog>
  </div>
</template>

<script>

import IM from "@c/Chat/index";
import { timeFormat } from "@/utils"
const getTime = () => {
  return new Date().getTime();
};
export default {
  name: "Message",
  components: {
    IM
  },
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      unread:0,
      dialogIsShow:true,
    };
  },
  computed: {
    // 监听全局socket消息状态
    formatTime() {
      return function(val) {
        return timeFormat(val);
      };
    }
  },
  watch: {
   // 全局调用发送消息
    dialogTableVisible (New) {
      if (New) {
        this.$nextTick(() => {
          this.dialogIsShow = New
        })
      }
    }
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    closeDialog () {
      this.appList = false
      this.$nextTick(() => {
        this.$emit('update:dialogTableVisible', false)
      })
    },
    contactSync (val) {
      this.dialogIsShow = true;
      this.$emit('update:dialogTableVisible', true);
    },
    
  }
};
</script>
<style scoped lang="scss">


.messageBoxStyle {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 1999;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: visible;
  .el-dialog__wrapper {
    display: flex;
    align-items: center;
  }
}

.sideMenu-message {
  margin-top: 0 !important;
  border-radius: 4px;
  .el-tab-pane {
    background: white;
  }
}

::v-deep .el-dialog {
  margin-right: 40% !important;
}

::v-deep .el-dialog__header {
    display: none;
  }
  
::v-deep .el-dialog__body {
  left: 50% !important;
  padding: 0px;
  border-radius: 2px 2px 2px 2px;
  height: 640px ;
  min-width: 600px ;
  width: 1000px ;
  overflow-y: hidden ;
}


</style>
