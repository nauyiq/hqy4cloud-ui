<template>
  <div>
    <div class="article flex align-center fadeInUp" :class="`wow${item.index}`" v-for="item in datas" :key="item.id">
      <div class="img-outer flex align-center justify-center" @click="toDetail(item.id)">
        <img :src="item.cover" alt @error="e => { e.target.src = onerrorImg() }" />
      </div>
      <div class="text-outer">
        <div class="info">
          <div class="time">{{item.month}} {{item.day}}, {{item.year}}</div>
          <div class="title" @click="toDetail(item.id)">
            <a>{{item.title}}</a>
          </div>
          <div class="description">{{item.description}}</div>
          <div class="handle flex align-center">
            <div class="handle-thunk flex align-center">
              <i class="iconfont icon-view"></i>
              <span>{{item.statistics.visits}}</span>
            </div>
            <div class="handle-thunk flex align-center">
              <i class="iconfont icon-xinheart118"></i>
              <span>{{item.statistics.likes}}</span>
            </div>
            <div class="handle-thunk flex align-center">
              <i class="iconfont icon-pinglun"></i>
              <span>{{item.statistics.comments}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loader flex align-center justify-center">
      <Loader v-show="isLoading"/>
      <span class="notMany" v-show="!isLoading && !isNext">- No More - </span>
    </div>
  </div>
</template>
<script>
import Button from "@c/Button";
import Loader from "@c/Loading";
import { WOW } from 'wowjs'

export default {
  components: { Button, Loader },
  props: {
    datas: {
      type: [Array, Object],
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isNext: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    datas() {
      this.$nextTick(() => {
        new WOW({ live: false, offset: 0,boxClass: `wow${this.wowNum}`, }).init()
        this.wowNum++
      })
    }
  },
  data() {
    return {
      wowNum: 0,
      pageLoad: true,
      buttonStyle: {
        padding: "8px 26px",
        fontSize: "14px",
        margin: "60px auto 0",
        borderRadius: "2px",
        display: "block"
      }
    };
  },
  methods: {
    toDetail (id) {
      this.$router.push({name: 'Detail', params: { id }})
    },
    onerrorImg() {
      return "https://file.hongqy1024.cn/files/blog/default_cover.jpg"
    }
  }
};
</script>
<style lang="less" scoped>
.article {
  position: relative;
  z-index: 2;
  &:not(:first-of-type) {
    margin-top: 100px;
  }
  &:nth-of-type(odd) {
    flex-direction: row-reverse;
  }
  .img-outer {
    width: 680px;
    height: 440px;
    font-size: 0;
    position: relative;
    cursor: pointer;
    z-index: 3;
    overflow: hidden;
    border-radius: 6px;
    border: 1px solid #f3fafd;
    transition: all 0.3s;
    flex: 0 0 auto;
    img {
      flex: 0 0 auto;
      width: 100%;
      height: 100%;
    }
  }
  .text-outer {
    padding: 80px 100px 0 80px;
    border: 1px solid #eaeaea;
    border-radius: 6px;
    height: 400px;
    width: 500px;
    .info {
      .time {
        color: #999;
        font-size: 12px;
      }
      .title {
        margin: 8px 0 2px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-weight: 500;
        a {
          font-size: 24px;
          line-height: 30px;
          cursor: pointer;
          //&:hover {
          //  text-decoration: none;
          //  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath fill='none' stroke='blue' d='M0 3.5c5 0 5-3 10-3s5 3 10 3 5-3 10-3 5 3 10 3'/%3E%3C/svg%3E") repeat-x 0 100%;
          //  background-size: 20px auto;
          //  animation: waveMove 1s infinite linear;
          //}
        }
      }
      .description {
        color: #666;
        font-size: 14px;
        line-height: 22px;
        margin-top: 10px;
        .text-overflow(3);
      }
      .handle {
        margin-top: 60px;
        font-size: 12px;
        color: #999;
        .handle-thunk {
          position: relative;
          &::after,
          &::before {
            opacity: 0;
            visibility: visible;
          }
          &::after {
            content: "浏览数";
            transform: translate(-50%, -5px);
            background: #ef6d57;
            white-space: nowrap;
            color: #fff;
            font-size: 12px;
            border-radius: 10px;
            padding: 5px 14px;
            position: absolute;
            bottom: 100%;
            left: 50%;
            transition: all 0.3s;
          }
          &::before {
            content: "";
            position: absolute;
            bottom: 100%;
            left: 50%;
            transition: all 0.3s;
            border: 5px solid transparent;
            border-top-color: #ef6d57;
            transform: translate(-50%, 5px);
          }
          &:hover {
            &::after,
            &::before {
              opacity: 1;
              visibility: visible;
            }
          }
          &:nth-of-type(1):hover {
            color: #ef6d57;
          }
          &:nth-of-type(2) {
            &::after {
              content: "喜欢人数";
            }
          }
          &:nth-of-type(3) {
            i {
              font-size: 16px;
              margin-right: 2px;
            }
            &::after {
              content: "评论数";
            }
          }
          &:nth-of-type(2):hover {
            color: #50bcb6;
            &::after {
              background-color: #50bcb6;
            }
            &::before {
              border-top-color: #50bcb6;
            }
          }
          &:nth-of-type(3):hover {
            color: #ffa800;
            &::after {
              background-color: #ffa800;
            }
            &::before {
              border-top-color: #ffa800;
            }
          }
          margin-right: 20px;
          i {
            font-size: 19px;
          }
        }
      }
    }
  }
}
.loader {
  height: 40px;
  margin-top: 30px;
  .notMany {
    letter-spacing: 2px;
    height: 34px;
    line-height: 36px;
    padding: 0 36px;
    color: #909090;
    border: 1px solid #eaeaea;
    border-radius: 4px;
  }
}
@media screen and (max-width: 1200px) {
  .article {
    .img-outer {
      width: 480px;
      height: 310px;
    }
    .text-outer {
      width: 420px;
      height: 290px;
      padding: 50px 60px 0;
      .info {
        .handle {
          margin-top: 30px;
        }
      }
    }
  }
}
@media screen and (max-width: 900px) {
  .article {
    flex-direction: column !important;
    border-bottom: 1px solid #eaeaea;
    .img-outer {
      width: 100%;
      height: auto;
      img {
        width: 680px;
        max-width: 100%;
      }
    }
    .text-outer {
      width: 96%;
      padding: 20px 20px;
      margin: auto;
      border: none;
      background: #fff;
      height: auto;
      .info {
        .handle {
          margin-top: 30px;
        }
        .description {
          .text-overflow(2);
        }
      }
    }
  }
}
</style>