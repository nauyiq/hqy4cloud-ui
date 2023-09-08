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
              <div class="main">
                <el-avatar :src="item.info.avatar"></el-avatar>
                <div @click="$user(item.info.id)"> <span class="nickname fc-primary cur-handle">{{item.info.nickname}}</span>
                  <div class="remark f-12 c-999">{{item.remark}}</div>
                </div>
                <div class="apply-status">

                </div>
              </div>
              <div class="option">
                <el-tag type="success" v-if="item.status === 1">已添加</el-tag>
                <el-tag type="danger" v-if="item.status === 2">已拒绝</el-tag>
                <el-popconfirm title="您确定接受该好友的申请吗？" v-if="item.status === 0" @confirm="acceptApply(item.info.id,true)">
                  <el-button slot="reference" :size="'small'" type="success">接受</el-button>
                </el-popconfirm>
                <el-popconfirm class="ml-15" title="您确定拒绝该好友的申请吗？" v-if="item.status=== 0" @confirm="acceptApply(item.info.id,false)">
                  <el-button slot="reference" :size="'small'" type="danger" >拒绝</el-button>
                </el-popconfirm>
              </div>
            </div>
            <div v-if="list.length === 0">
              <el-empty description="暂无数据"></el-empty>
            </div>
          </el-scrollbar>
        </div>
        <div class="apply-list-page" align="center" v-if="!singlePage">
          <el-pagination
              background
              :hide-on-single-page="singlePage"
              @size-change="handleChange"
              @current-change="getList"
              :current-page.sync="params.page"
              :page-sizes="[20, 50 ,100 , 200, 300, 400,500]"
              :page-size.sync="params.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>

import { getFriendApplications } from "@/api/im/friend"
import { mapState } from "vuex";
import defaultAvatar from '@/assets/img/default_avatar.png'

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
        is_mine:0
      }
    };
  },
  mounted() {
    this.getList();
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo,
    }),
  },
  methods: {
    handleClick() {
      this.params.page = 1;
      this.getList();
    },
    acceptApply(id,flag){
      let status = flag ? 1 : 0;
      this.$api.friendApi.acceptFriend({friend_id:id,status:status}).then(res=>{
        this.$message.success("操作成功");
        this.getList();
      })
    },
    getList(){
      getFriendApplications(this.params).then(res => {
        if (res.data.code === 0) {
          let result =  res.data.data
          this.list = result.resultList
          this.total = result.total
          console.log(this.list)
          this.singlePage = this.total <=this.params.limit;
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