<template>
  <div id="Maske">
    <Center class="center" />
    <div class="bg"></div>
    <div class="beian">
      <a href="https://beian.miit.gov.cn/">粤ICP备2022109316号-1</a>
    </div>
  </div>
</template>
<script>
import Center from "@c/Index/center";
export default {
  name: "maske",
  components: {
    Center
  },
};
</script>
<style lang="less" scoped>
#Maske {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  transition: all 0.5s;
  z-index: 5;
  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
  }
  .bg {
    width: 100%;
    height: 100vh;
    animation: change 15s infinite ;
    background: linear-gradient(125deg,#2980b9,#633bd3,#8e44ad,#192f44,#27ae60);
    background-size: 800%;
    z-index: -99;
  }
  .beian {
    z-index: 9999999;
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-weight: bold;
    letter-spacing: 2px;
    font-size: 14px;
    white-space: nowrap;
  }
  @keyframes change {
    0% { background-position-x: 0%;}
    50% { background-position-x: 100%; }
    100% { background-position-x: 0%;}
  }
}
@media screen and (max-width: 700px) {
  .beian {
    font-size: 14px !important;
  }
}
</style>