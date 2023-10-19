<template>
  <div>
    <!--图片-->
    <div v-if="imgShow">
      <img :src="downloadUrl"  />
    </div>
    <!--doc，excel-->
    <div v-else-if="docShow || excelShow">
      <iframe
          class="child"
          frameborder="0"
          :src="'https://view.officeapps.live.com/op/view.aspx?src=' + this.downloadUrl"
          :style="{ width: width, height: height }"
      >
      </iframe>
    </div>
    <!--视频-->
    <div v-else-if="videoShow">
      <video preload="auto" :height="height" :width="width" align="center" controls="true">
        <source :src="downloadUrl" type="video/mp4" />
      </video>
    </div>
    <!--其他不能预览的-->
    <div v-else-if="otherShow"></div>
  </div>
</template>
<script>
import Video from 'video.js';
import 'video.js/dist/video-js.css';
export default {
  props: { file: {} },
  data() {
    return {
      fileName: '',
      downloadUrl: '',
      imgShow: false,
      docShow: false,
      excelShow: false,
      videoShow: false,
      //其他不能预览的
      otherShow: false,
      height: window.innerHeight + 'px',
      width: '100%'
    };
  },
  created() {
    this.fileName = this.file.fileName;// 文件名称（包括后缀名）
    this.downloadUrl = this.file.downloadUrl;// 文件路径
    //.png, .jpeg, .jpg,
    // application/pdf, .txt, .xls, .xlsx, .doc, .docx,.ppt, .pptx,
    //.wps, .rtf,.pps, .ppsx,.mp4,.mp3,
    //.zip
    if (this.fileName.endsWith('png') || this.fileName.endsWith('jpg') || this.fileName.endsWith('jpeg')) {
      //图片
      this.imgShow = true;
    } else if (
        this.fileName.endsWith('docx') ||
        this.fileName.endsWith('doc') ||
        this.fileName.endsWith('pdf') ||
        this.fileName.endsWith('pptx') ||
        this.fileName.endsWith('ppt') ||
        this.fileName.endsWith('txt')
    ) {
      //doc
      this.docShow = true;
    } else if (this.fileName.endsWith('xlsx') || this.fileName.endsWith('xls')) {
      //excel
      this.excelShow = true;
    } else if (this.fileName.endsWith('mp4') || this.fileName.endsWith('mp3')) {
      this.videoShow = true;
    } else {
      this.otherShow = true;
    }
  }
};
</script>
<style scoped>
.child {
  width: 100%;
  height: 100%;
  scrolling: no;
  frameborder: 0;
  border: 0;
  marginwidth: 0;
  marginheight: 0;
}
</style>