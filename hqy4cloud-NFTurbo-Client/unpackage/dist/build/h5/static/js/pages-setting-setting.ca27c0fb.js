(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-setting-setting"],{"099a":function(t,e,a){"use strict";var o;a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return i})),a.d(e,"a",(function(){return o}));var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-button",{staticClass:"u-btn u-line-1 u-fix-ios-appearance",class:["u-size-"+t.size,t.plain?"u-btn--"+t.type+"--plain":"",t.loading?"u-loading":"","circle"==t.shape?"u-round-circle":"",t.hairLine?t.showHairLineBorder:"u-btn--bold-border","u-btn--"+t.type,t.disabled?"u-btn--"+t.type+"--disabled":""],style:[t.customStyle,{overflow:t.ripple?"hidden":"visible"}],attrs:{id:"u-wave-btn","hover-start-time":Number(t.hoverStartTime),"hover-stay-time":Number(t.hoverStayTime),disabled:t.disabled,"form-type":t.formType,"open-type":t.openType,"app-parameter":t.appParameter,"hover-stop-propagation":t.hoverStopPropagation,"send-message-title":t.sendMessageTitle,"send-message-path":"sendMessagePath",lang:t.lang,"data-name":t.dataName,"session-from":t.sessionFrom,"send-message-img":t.sendMessageImg,"show-message-card":t.showMessageCard,"hover-class":t.getHoverClass,loading:t.loading},on:{getphonenumber:function(e){arguments[0]=e=t.$handleEvent(e),t.getphonenumber.apply(void 0,arguments)},getuserinfo:function(e){arguments[0]=e=t.$handleEvent(e),t.getuserinfo.apply(void 0,arguments)},error:function(e){arguments[0]=e=t.$handleEvent(e),t.error.apply(void 0,arguments)},opensetting:function(e){arguments[0]=e=t.$handleEvent(e),t.opensetting.apply(void 0,arguments)},launchapp:function(e){arguments[0]=e=t.$handleEvent(e),t.launchapp.apply(void 0,arguments)},click:function(e){e.stopPropagation(),arguments[0]=e=t.$handleEvent(e),t.click(e)}}},[t._t("default"),t.ripple?a("v-uni-view",{staticClass:"u-wave-ripple",class:[t.waveActive?"u-wave-active":""],style:{top:t.rippleTop+"px",left:t.rippleLeft+"px",width:t.fields.targetWidth+"px",height:t.fields.targetWidth+"px","background-color":t.rippleBgColor||"rgba(0, 0, 0, 0.15)"}}):t._e()],2)},i=[]},"165e":function(t,e,a){"use strict";var o=a("3255"),n=a.n(o);n.a},"1ada":function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \n */.pay-modal[data-v-00140dbc]{padding-top:%?60?%;padding-bottom:%?60?%}.pay-modal-amount[data-v-00140dbc]{text-align:center}.pay-modal-amount-value[data-v-00140dbc]{font-size:%?60?%}.pay-modal-pay-way-tip[data-v-00140dbc]{text-align:center;font-size:small;line-height:2;padding-bottom:%?16?%}.pay-modal-pay-ways[data-v-00140dbc]{padding-left:%?32?%;padding-right:%?32?%;padding-bottom:%?96?%}.pay-modal-pay-way[data-v-00140dbc]{display:flex;align-items:center;justify-content:space-between}.pay-modal-pay-way-label[data-v-00140dbc]{font-size:%?36?%}.custom-pay-modal-btn[data-v-00140dbc]{width:80%}.u-image[data-v-00140dbc]{position:relative;transition:opacity .5s ease-in-out}.u-image__image[data-v-00140dbc]{width:100%;height:100%}.u-image__loading[data-v-00140dbc], .u-image__error[data-v-00140dbc]{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:row;align-items:center;justify-content:center;background-color:#f3f4f6;color:#909399;font-size:%?46?%}',""]),t.exports=e},"1b38":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={data:function(){return{updateNickNameFlag:!1,nickName:"",personalInfo:"",titleStyle:{}}},onLoad:function(){},onShow:function(){this.getMyPersonalInfo()},methods:{getBlockChainAddr:function(){if(this.personalInfo)return null===this.personalInfo.bindRealNameTime||""===this.personalInfo.bindRealNameTime?"实名认证后生成区块链地址...":this.personalInfo.blockChainAddr?this.personalInfo.blockChainAddr:"等待创建区块链地址..."},updateNickName:function(){var t=this;null!==t.nickName&&""!==t.nickName?this.$u.post("/member/updateNickName",{nickName:t.nickName}).then((function(e){t.updateNickNameFlag=!1,t.getMyPersonalInfo()})):uni.showToast({title:"请输入昵称",icon:"none"})},showUpdateNickNameModal:function(){this.updateNickNameFlag=!0,this.nickName=this.personalInfo.nickName},getAvatar:function(){return this.personalInfo.avatar?this.baseUrl+"/storage/fetch/"+this.personalInfo.avatar:"/static/img/avatar.png"},chooseAvatar:function(){var t=this;uni.chooseImage({count:1,success:function(e){var a={},o=uni.getStorageSync("tokenName"),n=uni.getStorageSync("tokenValue");a[o]=n,uni.uploadFile({url:t.baseUrl+"/storage/upload",filePath:e.tempFilePaths[0],header:a,name:"file_data",formData:{},success:function(e){t.updateAvatar(JSON.parse(e.data).data[0])}})}})},updateAvatar:function(t){var e=this;this.$u.post("/member/updateAvatar",{avatar:t}).then((function(t){e.getMyPersonalInfo()}))},bindRealName:function(){this.personalInfo.bindRealNameTime||this.gotoPage("../bindRealName/bindRealName")},logout:function(){this.$u.post("/logout").then((function(t){try{uni.removeStorageSync("tokenName")}catch(e){}uni.reLaunch({url:"../login/login"})}))},getMyPersonalInfo:function(){var t=this;uni.showLoading({title:""}),this.$u.get("/member/getMyPersonalInfo").then((function(e){t.personalInfo=e.data,uni.hideLoading()}))},gotoPage:function(t){uni.navigateTo({url:t})}}};e.default=o},2290:function(t,e,a){var o=a("1ada");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=a("4f06").default;n("49513309",o,!0,{sourceMap:!1,shadowMode:!1})},"2e56":function(t,e,a){"use strict";a.r(e);var o=a("099a"),n=a("f1fb");for(var i in n)"default"!==i&&function(t){a.d(e,t,(function(){return n[t]}))}(i);a("ee7b");var r,l=a("f0c5"),d=Object(l["a"])(n["default"],o["b"],o["c"],!1,null,"23f00fb2",null,!1,o["a"],r);e["default"]=d.exports},3255:function(t,e,a){var o=a("7f13");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=a("4f06").default;n("bb3725fa",o,!0,{sourceMap:!1,shadowMode:!1})},"38c9":function(t,e,a){"use strict";var o=a("2290"),n=a.n(o);n.a},"52a3":function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,'@charset "UTF-8";\n/**\n * 下方引入的为uView UI的集成样式文件，为scss预处理器，其中包含了一些"u-"开头的自定义变量\n * 使用的时候，请将下面的一行复制到您的uniapp项目根目录的uni.scss中即可\n * uView自定义的css类名和scss变量，均以"u-"开头，不会造成冲突，请放心使用 \n */.pay-modal[data-v-23f00fb2]{padding-top:%?60?%;padding-bottom:%?60?%}.pay-modal-amount[data-v-23f00fb2]{text-align:center}.pay-modal-amount-value[data-v-23f00fb2]{font-size:%?60?%}.pay-modal-pay-way-tip[data-v-23f00fb2]{text-align:center;font-size:small;line-height:2;padding-bottom:%?16?%}.pay-modal-pay-ways[data-v-23f00fb2]{padding-left:%?32?%;padding-right:%?32?%;padding-bottom:%?96?%}.pay-modal-pay-way[data-v-23f00fb2]{display:flex;align-items:center;justify-content:space-between}.pay-modal-pay-way-label[data-v-23f00fb2]{font-size:%?36?%}.custom-pay-modal-btn[data-v-23f00fb2]{width:80%}.u-btn[data-v-23f00fb2]::after{border:none}.u-btn[data-v-23f00fb2]{position:relative;border:0;display:inline-flex;overflow:visible;line-height:1;display:flex;flex-direction:row;align-items:center;justify-content:center;cursor:pointer;padding:0 %?40?%;z-index:1;box-sizing:border-box;transition:all .15s}.u-btn--bold-border[data-v-23f00fb2]{border:1px solid #fff}.u-btn--default[data-v-23f00fb2]{color:#606266;border-color:#c0c4cc;background-color:#fff}.u-btn--primary[data-v-23f00fb2]{color:#fff;border-color:#2979ff;background-color:#2979ff}.u-btn--success[data-v-23f00fb2]{color:#fff;border-color:#19be6b;background-color:#19be6b}.u-btn--error[data-v-23f00fb2]{color:#fff;border-color:#fa3534;background-color:#fa3534}.u-btn--warning[data-v-23f00fb2]{color:#fff;border-color:#f90;background-color:#f90}.u-btn--default--disabled[data-v-23f00fb2]{color:#fff;border-color:#e4e7ed;background-color:#fff}.u-btn--primary--disabled[data-v-23f00fb2]{color:#fff!important;border-color:#a0cfff!important;background-color:#a0cfff!important}.u-btn--success--disabled[data-v-23f00fb2]{color:#fff!important;border-color:#71d5a1!important;background-color:#71d5a1!important}.u-btn--error--disabled[data-v-23f00fb2]{color:#fff!important;border-color:#fab6b6!important;background-color:#fab6b6!important}.u-btn--warning--disabled[data-v-23f00fb2]{color:#fff!important;border-color:#fcbd71!important;background-color:#fcbd71!important}.u-btn--primary--plain[data-v-23f00fb2]{color:#2979ff!important;border-color:#a0cfff!important;background-color:#ecf5ff!important}.u-btn--success--plain[data-v-23f00fb2]{color:#19be6b!important;border-color:#71d5a1!important;background-color:#dbf1e1!important}.u-btn--error--plain[data-v-23f00fb2]{color:#fa3534!important;border-color:#fab6b6!important;background-color:#fef0f0!important}.u-btn--warning--plain[data-v-23f00fb2]{color:#f90!important;border-color:#fcbd71!important;background-color:#fdf6ec!important}.u-hairline-border[data-v-23f00fb2]:after{content:" ";position:absolute;pointer-events:none;box-sizing:border-box;-webkit-transform-origin:0 0;transform-origin:0 0;left:0;top:0;width:199.8%;height:199.7%;-webkit-transform:scale(.5);transform:scale(.5);border:1px solid currentColor;z-index:1}.u-wave-ripple[data-v-23f00fb2]{z-index:0;position:absolute;border-radius:100%;background-clip:padding-box;pointer-events:none;-webkit-user-select:none;user-select:none;-webkit-transform:scale(0);transform:scale(0);opacity:1;-webkit-transform-origin:center;transform-origin:center}.u-wave-ripple.u-wave-active[data-v-23f00fb2]{opacity:0;-webkit-transform:scale(2);transform:scale(2);transition:opacity 1s linear,-webkit-transform .4s linear;transition:opacity 1s linear,transform .4s linear;transition:opacity 1s linear,transform .4s linear,-webkit-transform .4s linear}.u-round-circle[data-v-23f00fb2]{border-radius:%?100?%}.u-round-circle[data-v-23f00fb2]::after{border-radius:%?100?%}.u-loading[data-v-23f00fb2]::after{background-color:hsla(0,0%,100%,.35)}.u-size-default[data-v-23f00fb2]{font-size:%?30?%;height:%?80?%;line-height:%?80?%}.u-size-medium[data-v-23f00fb2]{display:inline-flex;width:auto;font-size:%?26?%;height:%?70?%;line-height:%?70?%;padding:0 %?80?%}.u-size-mini[data-v-23f00fb2]{display:inline-flex;width:auto;font-size:%?22?%;padding-top:1px;height:%?50?%;line-height:%?50?%;padding:0 %?20?%}.u-primary-plain-hover[data-v-23f00fb2]{color:#fff!important;background:#2b85e4!important}.u-default-plain-hover[data-v-23f00fb2]{color:#2b85e4!important;background:#ecf5ff!important}.u-success-plain-hover[data-v-23f00fb2]{color:#fff!important;background:#18b566!important}.u-warning-plain-hover[data-v-23f00fb2]{color:#fff!important;background:#f29100!important}.u-error-plain-hover[data-v-23f00fb2]{color:#fff!important;background:#dd6161!important}.u-info-plain-hover[data-v-23f00fb2]{color:#fff!important;background:#82848a!important}.u-default-hover[data-v-23f00fb2]{color:#2b85e4!important;border-color:#2b85e4!important;background-color:#ecf5ff!important}.u-primary-hover[data-v-23f00fb2]{background:#2b85e4!important;color:#fff}.u-success-hover[data-v-23f00fb2]{background:#18b566!important;color:#fff}.u-info-hover[data-v-23f00fb2]{background:#82848a!important;color:#fff}.u-warning-hover[data-v-23f00fb2]{background:#f29100!important;color:#fff}.u-error-hover[data-v-23f00fb2]{background:#dd6161!important;color:#fff}',""]),t.exports=e},"59be":function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return i})),a.d(e,"a",(function(){return o}));var o={uIcon:a("8ed9").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"u-image",style:[t.wrapStyle,t.backgroundStyle],on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.onClick.apply(void 0,arguments)}}},[t.isError?t._e():a("v-uni-image",{staticClass:"u-image__image",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius)},attrs:{src:t.src,mode:t.mode,"lazy-load":t.lazyLoad,"show-menu-by-longpress":t.showMenuByLongpress},on:{error:function(e){arguments[0]=e=t.$handleEvent(e),t.onErrorHandler.apply(void 0,arguments)},load:function(e){arguments[0]=e=t.$handleEvent(e),t.onLoadHandler.apply(void 0,arguments)}}}),t.showLoading&&t.loading?a("v-uni-view",{staticClass:"u-image__loading",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius),backgroundColor:this.bgColor}},[t.$slots.loading?t._t("loading"):a("u-icon",{attrs:{name:t.loadingIcon,width:t.width,height:t.height}})],2):t._e(),t.showError&&t.isError&&!t.loading?a("v-uni-view",{staticClass:"u-image__error",style:{borderRadius:"circle"==t.shape?"50%":t.$u.addUnit(t.borderRadius)}},[t.$slots.error?t._t("error"):a("u-icon",{attrs:{name:t.errorIcon,width:t.width,height:t.height}})],2):t._e()],1)},i=[]},"68fa":function(t,e,a){"use strict";a.r(e);var o=a("1b38"),n=a.n(o);for(var i in o)"default"!==i&&function(t){a.d(e,t,(function(){return o[t]}))}(i);e["default"]=n.a},"7f13":function(t,e,a){var o=a("24fb");e=o(!1),e.push([t.i,"uni-page-body[data-v-31b0ee4c]{height:100%!important}.unreal-name[data-v-31b0ee4c]{display:inline-block;background:red;border-radius:%?10?%;width:%?10?%;height:%?10?%;margin-right:%?16?%;position:relative;top:%?-2?%}.nick-name-input[data-v-31b0ee4c]{background:#ebebeb;border-radius:%?32?%;margin:%?32?%;padding:%?20?% %?32?%}.avatar[data-v-31b0ee4c]{padding-right:%?16?%}.fixed-button-group[data-v-31b0ee4c]{position:fixed;bottom:%?60?%;left:%?0?%;width:100%;padding-left:%?32?%;padding-right:%?32?%}.common-modal[data-v-31b0ee4c]{padding-left:%?32?%;padding-right:%?32?%;padding-top:%?20?%;padding-bottom:%?20?%}.modal-title[data-v-31b0ee4c]{display:flex;justify-content:space-between}.modal-title-txt[data-v-31b0ee4c]{font-weight:700}.modal-content[data-v-31b0ee4c]{padding-top:%?10?%;padding-bottom:%?10?%}.login-duration-item[data-v-31b0ee4c]{padding-top:%?30?%;padding-bottom:%?30?%;display:flex;align-items:center}.login-duration-item-txt[data-v-31b0ee4c]{flex:1}",""]),t.exports=e},"93e8":function(t,e,a){"use strict";a.r(e);var o=a("59be"),n=a("f7ab");for(var i in n)"default"!==i&&function(t){a.d(e,t,(function(){return n[t]}))}(i);a("38c9");var r,l=a("f0c5"),d=Object(l["a"])(n["default"],o["b"],o["c"],!1,null,"00140dbc",null,!1,o["a"],r);e["default"]=d.exports},"94df":function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return i})),a.d(e,"a",(function(){return o}));var o={uModal:a("4e29").default,uCellGroup:a("4c01").default,uCellItem:a("d78f").default,uImage:a("93e8").default,uButton:a("2e56").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",[a("u-modal",{attrs:{title:"修改昵称","show-cancel-button":!0},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.updateNickName.apply(void 0,arguments)}},model:{value:t.updateNickNameFlag,callback:function(e){t.updateNickNameFlag=e},expression:"updateNickNameFlag"}},[a("v-uni-view",{staticClass:"slot-content"},[a("v-uni-input",{staticClass:"nick-name-input",attrs:{focus:!0},model:{value:t.nickName,callback:function(e){t.nickName=e},expression:"nickName"}})],1)],1),a("v-uni-view",{staticClass:"setting-info"},[a("u-cell-group",{attrs:{title:"个人信息",border:!1,"title-style":t.titleStyle}},[a("u-cell-item",{attrs:{title:"头像",arrow:!1,"border-bottom":!1,"title-style":t.titleStyle},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.chooseAvatar.apply(void 0,arguments)}}},[a("v-uni-view",{attrs:{slot:"right-icon"},slot:"right-icon"},[a("v-uni-view",{staticClass:"avatar"},[a("u-image",{attrs:{height:"54rpx",width:"54rpx",src:t.getAvatar(),shape:"circle"}})],1)],1)],1),a("u-cell-item",{attrs:{title:"昵称",arrow:!0,"border-bottom":!1,"title-style":t.titleStyle,value:t.personalInfo.nickName},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.showUpdateNickNameModal.apply(void 0,arguments)}}}),a("u-cell-item",{attrs:{title:"手机号",arrow:!1,"border-bottom":!1,"title-style":t.titleStyle,value:t.personalInfo.mobile}}),a("u-cell-item",{attrs:{title:"区块链地址",arrow:!1,"border-bottom":!1,"title-style":t.titleStyle}},[a("v-uni-view",{attrs:{slot:"label"},slot:"label"},[t._v(t._s(t.getBlockChainAddr()))])],1)],1),a("u-cell-group",{attrs:{title:"账号安全",border:!1,"title-style":t.titleStyle}},[a("u-cell-item",{attrs:{title:"实名认证",arrow:!0,"border-bottom":!1,"title-style":t.titleStyle},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.bindRealName.apply(void 0,arguments)}}},[a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.personalInfo,expression:"personalInfo"}],staticClass:"real-name"},[a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:null==t.personalInfo.bindRealNameTime||""==t.personalInfo.bindRealNameTime,expression:"personalInfo.bindRealNameTime == null || personalInfo.bindRealNameTime == ''"}],staticClass:"unreal-name"}),t._v(t._s(t.personalInfo.bindRealNameTime?"已认证":"未认证"))],1)],1),a("u-cell-item",{attrs:{title:"查看登录记录",arrow:!0,"border-bottom":!1},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.gotoPage("../loginRecord/loginRecord")}}},[a("v-uni-view",{attrs:{slot:"label"},slot:"label"},[t._v("最近登录时间： "+t._s(t.personalInfo.latelyLoginTime))])],1)],1)],1),a("v-uni-view",{staticClass:"fixed-button-group"},[a("u-button",{attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.logout.apply(void 0,arguments)}}},[t._v("退出登录")])],1)],1)},i=[]},b495:function(t,e,a){"use strict";a("c975"),a("a9e3"),a("d3b7"),a("ac1f"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={name:"u-button",props:{hairLine:{type:Boolean,default:!0},type:{type:String,default:"default"},size:{type:String,default:"default"},shape:{type:String,default:"square"},plain:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},openType:{type:String,default:""},formType:{type:String,default:""},appParameter:{type:String,default:""},hoverStopPropagation:{type:Boolean,default:!1},lang:{type:String,default:"en"},sessionFrom:{type:String,default:""},sendMessageTitle:{type:String,default:""},sendMessagePath:{type:String,default:""},sendMessageImg:{type:String,default:""},showMessageCard:{type:Boolean,default:!1},hoverBgColor:{type:String,default:""},rippleBgColor:{type:String,default:""},ripple:{type:Boolean,default:!1},hoverClass:{type:String,default:""},customStyle:{type:Object,default:function(){return{}}},dataName:{type:String,default:""},throttleTime:{type:[String,Number],default:1e3},hoverStartTime:{type:[String,Number],default:20},hoverStayTime:{type:[String,Number],default:150}},computed:{getHoverClass:function(){if(this.loading||this.disabled||this.ripple||this.hoverClass)return"";var t="";return t=this.plain?"u-"+this.type+"-plain-hover":"u-"+this.type+"-hover",t},showHairLineBorder:function(){return["primary","success","error","warning"].indexOf(this.type)>=0&&!this.plain?"":"u-hairline-border"}},data:function(){return{rippleTop:0,rippleLeft:0,fields:{},waveActive:!1}},methods:{click:function(t){var e=this;this.$u.throttle((function(){!0!==e.loading&&!0!==e.disabled&&(e.ripple&&(e.waveActive=!1,e.$nextTick((function(){this.getWaveQuery(t)}))),e.$emit("click",t))}),this.throttleTime)},getWaveQuery:function(t){var e=this;this.getElQuery().then((function(a){var o=a[0];if(o.width&&o.width&&(o.targetWidth=o.height>o.width?o.height:o.width,o.targetWidth)){e.fields=o;var n="",i="";n=t.touches[0].clientX,i=t.touches[0].clientY,e.rippleTop=i-o.top-o.targetWidth/2,e.rippleLeft=n-o.left-o.targetWidth/2,e.$nextTick((function(){e.waveActive=!0}))}}))},getElQuery:function(){var t=this;return new Promise((function(e){var a="";a=uni.createSelectorQuery().in(t),a.select(".u-btn").boundingClientRect(),a.exec((function(t){e(t)}))}))},getphonenumber:function(t){this.$emit("getphonenumber",t)},getuserinfo:function(t){this.$emit("getuserinfo",t)},error:function(t){this.$emit("error",t)},opensetting:function(t){this.$emit("opensetting",t)},launchapp:function(t){this.$emit("launchapp",t)}}};e.default=o},d84d:function(t,e,a){var o=a("52a3");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var n=a("4f06").default;n("52ebce9a",o,!0,{sourceMap:!1,shadowMode:!1})},db34:function(t,e,a){"use strict";a("a9e3"),Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o={name:"u-image",props:{src:{type:String,default:""},mode:{type:String,default:"aspectFill"},width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"auto"},shape:{type:String,default:"square"},borderRadius:{type:[String,Number],default:0},lazyLoad:{type:Boolean,default:!0},showMenuByLongpress:{type:Boolean,default:!0},loadingIcon:{type:String,default:"photo"},errorIcon:{type:String,default:"error-circle"},showLoading:{type:Boolean,default:!0},showError:{type:Boolean,default:!0},fade:{type:Boolean,default:!0},webp:{type:Boolean,default:!1},duration:{type:[String,Number],default:500},bgColor:{type:String,default:"#f3f4f6"}},data:function(){return{isError:!1,loading:!0,opacity:1,durationTime:this.duration,backgroundStyle:{}}},watch:{src:{immediate:!0,handler:function(t){t?this.isError=!1:(this.isError=!0,this.loading=!1)}}},computed:{wrapStyle:function(){var t={};return t.width=this.$u.addUnit(this.width),t.height=this.$u.addUnit(this.height),t.borderRadius="circle"==this.shape?"50%":this.$u.addUnit(this.borderRadius),t.overflow=this.borderRadius>0?"hidden":"visible",this.fade&&(t.opacity=this.opacity,t.transition="opacity ".concat(Number(this.durationTime)/1e3,"s ease-in-out")),t}},methods:{onClick:function(){this.$emit("click")},onErrorHandler:function(t){this.loading=!1,this.isError=!0,this.$emit("error",t)},onLoadHandler:function(){var t=this;if(this.loading=!1,this.isError=!1,this.$emit("load"),!this.fade)return this.removeBgColor();this.opacity=0,this.durationTime=0,setTimeout((function(){t.durationTime=t.duration,t.opacity=1,setTimeout((function(){t.removeBgColor()}),t.durationTime)}),50)},removeBgColor:function(){this.backgroundStyle={backgroundColor:"transparent"}}}};e.default=o},ee7b:function(t,e,a){"use strict";var o=a("d84d"),n=a.n(o);n.a},f1fb:function(t,e,a){"use strict";a.r(e);var o=a("b495"),n=a.n(o);for(var i in o)"default"!==i&&function(t){a.d(e,t,(function(){return o[t]}))}(i);e["default"]=n.a},f476:function(t,e,a){"use strict";a.r(e);var o=a("94df"),n=a("68fa");for(var i in n)"default"!==i&&function(t){a.d(e,t,(function(){return n[t]}))}(i);a("165e");var r,l=a("f0c5"),d=Object(l["a"])(n["default"],o["b"],o["c"],!1,null,"31b0ee4c",null,!1,o["a"],r);e["default"]=d.exports},f7ab:function(t,e,a){"use strict";a.r(e);var o=a("db34"),n=a.n(o);for(var i in o)"default"!==i&&function(t){a.d(e,t,(function(){return o[t]}))}(i);e["default"]=n.a}}]);