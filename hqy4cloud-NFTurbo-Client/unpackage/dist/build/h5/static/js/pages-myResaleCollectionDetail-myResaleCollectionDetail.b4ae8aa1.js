(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-myResaleCollectionDetail-myResaleCollectionDetail"],{"151d":function(t,e,i){var a=i("83d2");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("7007bd86",a,!0,{sourceMap:!1,shadowMode:!1})},"1ada":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \n */.pay-modal[data-v-00140dbc]{padding-top:%?60?%;padding-bottom:%?60?%}.pay-modal-amount[data-v-00140dbc]{text-align:center}.pay-modal-amount-value[data-v-00140dbc]{font-size:%?60?%}.pay-modal-pay-way-tip[data-v-00140dbc]{text-align:center;font-size:small;line-height:2;padding-bottom:%?16?%}.pay-modal-pay-ways[data-v-00140dbc]{padding-left:%?32?%;padding-right:%?32?%;padding-bottom:%?96?%}.pay-modal-pay-way[data-v-00140dbc]{display:flex;align-items:center;justify-content:space-between}.pay-modal-pay-way-label[data-v-00140dbc]{font-size:%?36?%}.custom-pay-modal-btn[data-v-00140dbc]{width:80%}.u-image[data-v-00140dbc]{position:relative;transition:opacity .5s ease-in-out}.u-image__image[data-v-00140dbc]{width:100%;height:100%}.u-image__loading[data-v-00140dbc], .u-image__error[data-v-00140dbc]{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:row;align-items:center;justify-content:center;background-color:#f3f4f6;color:#909399;font-size:%?46?%}',""]),t.exports=e},"1f92":function(t,e,i){"use strict";var a=i("151d"),n=i.n(a);n.a},2290:function(t,e,i){var a=i("1ada");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("49513309",a,!0,{sourceMap:!1,shadowMode:!1})},3703:function(t,e,i){"use strict";i("ac1f"),i("38cf"),i("5319"),i("1276"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={data:function(){return{collectionId:"",collectionDetail:"",showCancelResaleModalFlag:!1}},onLoad:function(t){this.collectionId=t.id,this.getCollectionDetail()},methods:{creatorPage:function(){uni.navigateTo({url:"../creator/creator?id="+this.collectionDetail.creatorId})},canCancel:function(){var t=this.collectionDetail.lockPayMemberId;return null===t||""===t},issuedCollectionActionLogPage:function(){uni.navigateTo({url:"../issuedCollectionActionLog/issuedCollectionActionLog?id="+this.collectionDetail.issuedCollectionId})},getHolderAvatar:function(){return this.collectionDetail.holderAvatar?this.baseUrl+"/storage/fetch/"+this.collectionDetail.holderAvatar:"/static/img/avatar.png"},cancelResale:function(){var t=this;this.$u.post("/transaction/cancelResale",{resaleCollectionId:t.collectionId}).then((function(t){uni.showToast({icon:"success",title:"取消成功!",duration:2e3,mask:!0,complete:function(){setTimeout((function(){uni.reLaunch({url:"../my/my"})}),2e3)}})}))},moneyFormat:function(t,e){if(e=e||2,!t&&0!==t)return"";if(isNaN(+t))return"";if(0===t||"0"===t)return"0."+"0".repeat(e);var i=(t+"").split("."),a=i[0]?i[0]:0,n=i[1]?i[1]:0;return n=0===n?"0".repeat(e):(+("0."+n)).toFixed(e).split(".")[1],t=(a+"."+n).replace(/(\d{1,3})(?=(?:\d{3})+\.)/g,"$1,"),t},getCollectionDetail:function(){var t=this;this.$u.get("/myArtwork/findMyResaleCollectionDetail",{id:t.collectionId}).then((function(e){t.collectionDetail=e.data,uni.setNavigationBarTitle({title:t.collectionDetail.collectionName})}))}}};e.default=a},"38c9":function(t,e,i){"use strict";var a=i("2290"),n=i.n(a);n.a},"59be":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}));var a={uIcon:i("8ed9").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"u-image",style:[t.wrapStyle,t.backgroundStyle],on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onClick.apply(void 0,arguments)}}},[t.isError?t._e():i("v-uni-image",{staticClass:"u-image__image",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius)},attrs:{src:t.src,mode:t.mode,"lazy-load":t.lazyLoad,"show-menu-by-longpress":t.showMenuByLongpress},on:{error:function(e){arguments[0]=e=t.$handleEvent(e),t.onErrorHandler.apply(void 0,arguments)},load:function(e){arguments[0]=e=t.$handleEvent(e),t.onLoadHandler.apply(void 0,arguments)}}}),t.showLoading&&t.loading?i("v-uni-view",{staticClass:"u-image__loading",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius),backgroundColor:this.bgColor}},[t.$slots.loading?t._t("loading"):i("u-icon",{attrs:{name:t.loadingIcon,width:t.width,height:t.height}})],2):t._e(),t.showError&&t.isError&&!t.loading?i("v-uni-view",{staticClass:"u-image__error",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius)}},[t.$slots.error?t._t("error"):i("u-icon",{attrs:{name:t.errorIcon,width:t.width,height:t.height}})],2):t._e()],1)},o=[]},"7a36":function(t,e,i){"use strict";i.r(e);var a=i("96ca"),n=i("d9ce");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("1f92");var l,c=i("f0c5"),r=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"28159360",null,!1,a["a"],l);e["default"]=r.exports},"83d2":function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".action-log[data-v-28159360]{display:flex;justify-content:space-between;align-items:center;padding:%?16?%}.action-log-l[data-v-28159360]{color:#353535;font-size:%?36?%}.div-line[data-v-28159360]{width:100%;height:%?20?%;background:#f0f0f0}.common-modal[data-v-28159360]{padding-left:%?32?%;padding-right:%?32?%;padding-top:%?20?%;padding-bottom:%?20?%}.modal-title[data-v-28159360]{display:flex;justify-content:space-between}.modal-title-txt[data-v-28159360]{font-weight:700}.close-modal-txt[data-v-28159360]{color:#909399}.modal-tip[data-v-28159360]{padding-bottom:%?32?%}.give-to-account[data-v-28159360]{line-height:6.5}.give-to-account uni-text[data-v-28159360]{padding-left:%?12?%}.limit[data-v-28159360]{color:#fff}.tech-title[data-v-28159360]{font-size:%?36?%;padding-top:%?16?%;padding-bottom:%?16?%;padding-left:%?16?%}.tech-info-item[data-v-28159360]{display:flex;justify-content:space-between;line-height:2;font-size:%?28?%;padding-left:%?32?%;padding-right:%?32?%}.tech-info-item-label[data-v-28159360]{flex-basis:70%}.tech-info-item-value[data-v-28159360]{opacity:.6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right;color:#000}.tech-support-txt[data-v-28159360]{padding-left:%?10?%}.tech-support[data-v-28159360]{display:flex;align-items:center;color:#888;justify-content:center;line-height:3.5}.buy-instructions[data-v-28159360]{background:rgb(36 35 35/60%);border-radius:%?20?%;padding-left:%?12?%;padding-right:%?12?%;padding-top:%?12?%;padding-bottom:%?36?%}.buy-instructions-title[data-v-28159360]{color:#fff;text-align:center;font-size:large;font-weight:700;line-height:3}.buy-instructions-content[data-v-28159360]{color:#888}.lock-icon[data-v-28159360]{padding-right:%?6?%}.buy-lock-tip[data-v-28159360]{display:flex;align-items:center;color:#888;justify-content:center;line-height:3}.buy-lock-tip-content[data-v-28159360]{margin-left:%?20?%;margin-right:%?20?%}.holder-info[data-v-28159360]{display:flex;color:#888;align-items:center;padding-bottom:%?16?%;padding-left:%?16?%;padding-right:%?16?%}.holder-info-r[data-v-28159360]{padding-left:%?20?%;flex:1;width:0}.holder-info-rt[data-v-28159360]{font-size:%?26?%;display:flex;align-items:center}.holder-nick-name[data-v-28159360]{color:#000;padding-right:%?16?%}.holder-info-rb[data-v-28159360]{opacity:.6;color:#000}.creator-info[data-v-28159360]{display:flex;color:#888;align-items:center;padding-bottom:%?16?%;padding-left:%?16?%;padding-right:%?16?%;padding-top:%?16?%}.creator-info-r[data-v-28159360]{padding-left:%?20?%;flex:1;width:0;padding-right:%?16?%}.creator-info-rt[data-v-28159360]{font-size:%?26?%}.creator-info-rb[data-v-28159360]{color:#353535}.creator-info-r2[data-v-28159360]{text-align:right;color:#353535;font-size:small}.story-title[data-v-28159360]{color:#353535;font-size:%?36?%;padding-bottom:%?16?%;padding-left:%?16?%;padding-top:%?16?%}.story-content[data-v-28159360]{display:flex;flex-direction:column}.fixed-bottom-navs[data-v-28159360]{display:flex;justify-content:space-around;align-items:center}.fixed-bottom-nav[data-v-28159360]{color:#222;text-align:center;padding-top:%?20?%;padding-bottom:%?20?%}.cancel-btn[data-v-28159360]{background:red;font-size:large;font-weight:700;color:#fff;padding:%?20?% %?60?%}.lock-btn[data-v-28159360]{background:#777;font-size:large;font-weight:700;color:#fff;padding:%?20?% %?60?%}.price-info[data-v-28159360]{display:flex;color:#353535;font-size:large;font-weight:700;line-height:4}.price-info uni-view[data-v-28159360]{padding-right:%?8?%}.fixed-bottom-content[data-v-28159360]{display:flex;align-items:center;justify-content:space-between}.fixed-bottom[data-v-28159360]{position:fixed;bottom:%?0?%;left:%?0?%;width:100%;background:#fff;padding-left:%?32?%;padding-right:%?32?%}.collection-info[data-v-28159360]{display:flex;justify-content:space-around;position:relative;top:%?-80?%}.collection-name[data-v-28159360]{padding-bottom:%?16?%;display:flex;justify-content:space-between;padding-right:%?16?%;align-items:center}.collection-name-inner[data-v-28159360]{color:#4c4c4c;font-size:large;font-weight:700;padding-left:%?16?%;flex:1}.page-content[data-v-28159360]{padding-bottom:%?140?%}",""]),t.exports=e},"93e8":function(t,e,i){"use strict";i.r(e);var a=i("59be"),n=i("f7ab");for(var o in n)"default"!==o&&function(t){i.d(e,t,(function(){return n[t]}))}(o);i("38c9");var l,c=i("f0c5"),r=Object(c["a"])(n["default"],a["b"],a["c"],!1,null,"00140dbc",null,!1,a["a"],l);e["default"]=r.exports},"96ca":function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return o})),i.d(e,"a",(function(){return a}));var a={uModal:i("4e29").default,uImage:i("93e8").default,uTag:i("41c5").default,uLine:i("401b").default,uIcon:i("8ed9").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"page-content"},[i("u-modal",{attrs:{title:"提示","show-cancel-button":!0,"cancel-text":"暂时不要","confirm-text":"取消发布",content:"是否要取消发布"},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.cancelResale.apply(void 0,arguments)}},model:{value:t.showCancelResaleModalFlag,callback:function(e){t.showCancelResaleModalFlag=e},expression:"showCancelResaleModalFlag"}}),i("v-uni-view",{staticClass:"collection-cover"},[i("v-uni-image",{staticStyle:{width:"100%"},attrs:{mode:"widthFix",src:t.collectionDetail.collectionCover}})],1),i("v-uni-view",{staticClass:"collection-name"},[i("v-uni-view",{staticClass:"collection-name-inner"},[t._v(t._s(t.collectionDetail.collectionName))]),i("v-uni-view",{staticClass:"collection-number"},[t._v("# "+t._s(t.collectionDetail.collectionSerialNumber)+"/"+t._s(t.collectionDetail.quantity))])],1),i("v-uni-view",{staticClass:"holder-info"},[i("v-uni-view",[i("u-image",{staticClass:"holder-avatar",attrs:{width:"72rpx",height:"72rpx",shape:"circle",src:t.getHolderAvatar()}})],1),i("v-uni-view",{staticClass:"holder-info-r"},[i("v-uni-view",{staticClass:"holder-info-rt"},[i("v-uni-text",{staticClass:"holder-nick-name"},[t._v(t._s(t.collectionDetail.holderNickName))]),i("u-tag",{attrs:{text:"持有者",type:"primary",size:"mini",mode:"dark"}})],1),i("v-uni-view",{staticClass:"holder-info-rb u-line-1"},[t._v(t._s(t.collectionDetail.holderBlockChainAddr))])],1)],1),i("u-line",{attrs:{color:"#cecece"}}),i("v-uni-view",{staticClass:"creator-info"},[i("v-uni-view",[i("u-image",{staticClass:"creator-avatar",attrs:{width:"72rpx",height:"72rpx",shape:"circle",src:t.collectionDetail.creatorAvatar}})],1),i("v-uni-view",{staticClass:"creator-info-r"},[i("v-uni-view",{staticClass:"creator-info-rt"},[t._v("创作者")]),i("v-uni-view",{staticClass:"creator-info-rb u-line-1"},[t._v(t._s(t.collectionDetail.creatorName))])],1),i("v-uni-view",{staticClass:"creator-info-r2",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.creatorPage.apply(void 0,arguments)}}},[t._v("更多作品"),i("u-icon",{attrs:{name:"arrow-right",size:"22"}})],1)],1),i("v-uni-view",{staticClass:"div-line"}),i("v-uni-view",{staticClass:"info-block"},[i("v-uni-view",{staticClass:"tech-info"},[i("v-uni-view",{staticClass:"tech-title"},[t._v("技术信息")]),i("v-uni-view",{staticClass:"tech-info-content"},[i("v-uni-view",{staticClass:"tech-info-item"},[i("v-uni-text",{staticClass:"tech-info-item-label"},[t._v("唯一标识")]),i("v-uni-text",{staticClass:"tech-info-item-value"},[t._v(t._s(t.collectionDetail.uniqueId?t.collectionDetail.uniqueId:"上链确认中"))])],1),i("v-uni-view",{staticClass:"tech-info-item"},[i("v-uni-text",{staticClass:"tech-info-item-label"},[t._v("作品HASH")]),i("v-uni-text",{staticClass:"tech-info-item-value"},[t._v(t._s(t.collectionDetail.collectionHash))])],1),i("v-uni-view",{staticClass:"tech-info-item"},[i("v-uni-text",{staticClass:"tech-info-item-label"},[t._v("交易HASH")]),i("v-uni-text",{staticClass:"tech-info-item-value"},[t._v(t._s(t.collectionDetail.transactionHash?t.collectionDetail.transactionHash:"上链确认中"))])],1)],1)],1),i("v-uni-view",{staticClass:"div-line"}),i("v-uni-view",{staticClass:"story"},[i("v-uni-view",{staticClass:"story-title"},[t._v("作品故事")]),i("v-uni-view",{staticClass:"story-content"},t._l(t.collectionDetail.storyPicLinks,(function(t){return i("v-uni-image",{staticStyle:{width:"100%"},attrs:{mode:"widthFix",src:t}})})),1)],1),i("v-uni-view",{staticClass:"action-log"},[i("v-uni-view",{staticClass:"action-log-l"},[t._v("流转记录")]),i("v-uni-view",{staticClass:"action-log-r",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.issuedCollectionActionLogPage.apply(void 0,arguments)}}},[t._v("查看流转记录"),i("u-icon",{attrs:{name:"arrow-right"}})],1)],1)],1),i("v-uni-view",{staticClass:"fixed-bottom"},[i("v-uni-view",{staticClass:"fixed-bottom-content"},[i("v-uni-view",{staticClass:"price-info"},[i("v-uni-view",[t._v("￥")]),i("v-uni-view",[t._v(t._s(t.moneyFormat(t.collectionDetail.resalePrice)))])],1),i("v-uni-view",[i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.collectionDetail&&t.canCancel(),expression:"collectionDetail && canCancel()"}],staticClass:"cancel-btn",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.showCancelResaleModalFlag=!0}}},[t._v("取消发布")]),i("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.collectionDetail&&!t.canCancel(),expression:"collectionDetail && !canCancel()"}],staticClass:"lock-btn"},[t._v("商品锁定中，待支付...")])],1)],1)],1)],1)},o=[]},d9ce:function(t,e,i){"use strict";i.r(e);var a=i("3703"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a},db34:function(t,e,i){"use strict";i("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"u-image",props:{src:{type:String,default:""},mode:{type:String,default:"aspectFill"},width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"auto"},shape:{type:String,default:"square"},borderRadius:{type:[String,Number],default:0},lazyLoad:{type:Boolean,default:!0},showMenuByLongpress:{type:Boolean,default:!0},loadingIcon:{type:String,default:"photo"},errorIcon:{type:String,default:"error-circle"},showLoading:{type:Boolean,default:!0},showError:{type:Boolean,default:!0},fade:{type:Boolean,default:!0},webp:{type:Boolean,default:!1},duration:{type:[String,Number],default:500},bgColor:{type:String,default:"#f3f4f6"}},data:function(){return{isError:!1,loading:!0,opacity:1,durationTime:this.duration,backgroundStyle:{}}},watch:{src:{immediate:!0,handler:function(t){t?this.isError=!1:(this.isError=!0,this.loading=!1)}}},computed:{wrapStyle:function(){var t={};return t.width=this.$u.addUnit(this.width),t.height=this.$u.addUnit(this.height),t.borderRadius="circle"==this.shape?"50%":this.$u.addUnit(this.borderRadius),t.overflow=this.borderRadius>0?"hidden":"visible",this.fade&&(t.opacity=this.opacity,t.transition="opacity ".concat(Number(this.durationTime)/1e3,"s ease-in-out")),t}},methods:{onClick:function(){this.$emit("click")},onErrorHandler:function(t){this.loading=!1,this.isError=!0,this.$emit("error",t)},onLoadHandler:function(){var t=this;if(this.loading=!1,this.isError=!1,this.$emit("load"),!this.fade)return this.removeBgColor();this.opacity=0,this.durationTime=0,setTimeout((function(){t.durationTime=t.duration,t.opacity=1,setTimeout((function(){t.removeBgColor()}),t.durationTime)}),50)},removeBgColor:function(){this.backgroundStyle={backgroundColor:"transparent"}}}};e.default=a},f7ab:function(t,e,i){"use strict";i.r(e);var a=i("db34"),n=i.n(a);for(var o in a)"default"!==o&&function(t){i.d(e,t,(function(){return a[t]}))}(o);e["default"]=n.a}}]);