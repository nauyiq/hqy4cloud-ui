<template>
  <el-container>
    <el-header class="slider-aside">
      <span>新的朋友</span>
    </el-header>
    <el-main class="no-padding">
      <div class="apply-list">
        <div class="apply-list-main">
          <el-scrollbar>
            <div class="apply-list-item" v-for="(item, index) in list" :key="index" >
              <div class="main" style="margin-left: 5px">
                  <el-avatar :src="item.info.avatar"></el-avatar>
                  <div style="margin-left: 5px">
                    <div @click="$user(item.info.id)"> <span class="nickname fc-primary cur-handle">{{item.info.nickname}}</span>
                      <div class="remark f-12 c-999">{{item.remark}}</div>
                    </div>
                  </div>
              </div>
              <div class="option">
                <el-tag type="success" v-if="item.status === 1">已添加</el-tag>
                <div v-if="item.status === 2">
                  <el-tag type="info" v-if="item.send === user.id">已申请</el-tag>
                  <el-tag type="info" v-else>已拒绝</el-tag>
                </div>
                <div v-if="item.status === 0">
                  <div v-if="item.send !== user.id">
                    <el-button slot="reference" :size="'small'" type="primary"  @click="acceptApply(item.id,true)">接受</el-button>
                    <el-button slot="reference" :size="'small'" type="info"  @click="acceptApply(item.id,false)">拒绝</el-button>
                  </div>
                  <el-tag type="info" v-else>已申请</el-tag>
                </div>

<!--                <el-tag type="info" v-if="item.status === 2">已拒绝</el-tag>-->
<!--                <el-button slot="reference" :size="'small'" type="primary" v-if="item.status === 0 && item.info.send !== user.id" @click="acceptApply(item.info.id,true)">接受</el-button>-->
<!--                <el-button slot="reference" :size="'small'" type="info" v-if=" item.status === 0 && item.info.send !== user.id" @click="acceptApply(item.info.id,false)">拒绝</el-button>-->
              </div>
            </div>
            <div v-if="list.length === 0">
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>

import { getFriendApplications, acceptOrRejectImFriend } from "@/api/im/friend"
import { mapState } from "vuex";

export default {
  name: "apply",
  data() {
    return {
      singlePage:true,
      total:0,
      list: [],
      activeName: "receive",
      params: {
        page: 1,
        limit: 20,
      }
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo,
      refreshApplication: state => state.user.refreshApplication,

    }),
  },
  watch: {
    refreshApplication() {
      this.getList()
    }
  },
  methods: {
    handleClick() {
      this.getList();
    },
    acceptApply(id,flag){
      acceptOrRejectImFriend({
        applicationId:id,
        status: flag
      }).then( res => {
        if (res.data.code === 0) {
          this.getList()
        }
      })
    },
    getList(){
      getFriendApplications().then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data
        }
      })
    },
    handleChange(val) {
      this.params.limit = val;
      this.getList();
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/style";

.slider-aside {
  height:50px !important;
  background-color: #f9f9f9;
  line-height: 46px;
  font-size: 18px;
  font-weight: 600;
}
.tab-diy{
  width:160px;
  margin:0 auto;
}
::v-deep .el-tabs__nav-wrap:after{
  height:0 !important;
}

.apply-list{
  display: flex;
  flex-direction: column;
  height:100%;
  background: #fff !important;
  .apply-list-main{
    flex:1;
    overflow: auto;
    .apply-list-item{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom:solid 1px #f6f6f6;
      padding:10px;
      &:hover{
        background-color: #f6f6f6;
      }
      .avatar{
        width: 50px;
        margin-right: 10px;
      }
      .main{
        padding-left: 20px;
        flex:1;
        display: flex;
      }
      .option{
        width: auto;
        display: flex;
        overflow-x: hidden;
        padding-right: 10px;
      }
      .nickname {
        font-size: 14px;
        font-weight: 400;
      }
      .remark {
        margin-top: 5px;
      }
    }
  }
  .apply-list-page{
    height:50px;
  }

}

</style>