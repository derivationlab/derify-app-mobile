(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-113dd4df"],{"1d72":function(t,a,s){},5931:function(t,a,s){"use strict";s("1d72")},ac0d:function(t,a,s){"use strict";s.r(a);var n=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"home-container page-container"},[s("van-nav-bar",{attrs:{title:"资金划转","left-arrow":"",border:!1,fixed:!0},on:{"click-left":t.onClickLeft},scopedSlots:t._u([{key:"left",fn:function(){return[s("van-icon",{attrs:{name:"arrow-left",color:"rgba(255, 255, 255, .85)",size:"2.4rem"}})]},proxy:!0}])}),s("div",{staticClass:"from-div"},[t._v("From")]),s("van-cell-group",[s("van-field",{staticClass:"derify-input no-padding-hor",attrs:{placeholder:"deposit"===t.type?"Metamask Wallet":"Derify Account",border:!1}})],1),s("div",{staticClass:"to-div",on:{click:t.changeType}},[s("span",{staticClass:"span1"},[t._v("to")]),s("van-icon",{staticClass:"span2",attrs:{name:"exchange",size:"2rem"}})],1),s("van-cell-group",[s("van-field",{staticClass:"derify-input no-padding-hor",attrs:{placeholder:"deposit"===t.type?"Derify Account":"Metamask Wallet"}})],1),s("div",{staticClass:"num-div"},[t._v("数量")]),s("van-cell-group",[s("van-field",{staticClass:"derify-input no-padding-hor",attrs:{type:"number"},model:{value:t.amount,callback:function(a){t.amount=a},expression:"amount"}}),s("span",{staticClass:"unit"},[t._v("USDT")])],1),s("div",{staticClass:"transfer-div"},[s("span",{staticClass:"span1"},[t._v("可划转："+t._s(t._f("fck")(t.account.accountBalance,-8))+" USDT")]),s("span",{staticClass:"span2"},[t._v("全部划转")])]),"deposit"===t.type?s("div",{staticClass:"pay-div",on:{click:t.deposit}},[t._v("充值")]):t._e(),"withdraw"===t.type?s("div",{staticClass:"pay-div",on:{click:t.withdraw}},[t._v("提现")]):t._e()],1)},e=[],i={name:"transfer",data:function(){return{amount:"",type:"deposit"}},computed:{account:function(){return this.$store.state.contract.account}},mounted:function(){this.type=this.$route.query&&this.$route.query.type||"deposit"},methods:{onClickLeft:function(){this.$router.go(-1)},changeType:function(){this.type="deposit"===this.type?"withdraw":"deposit"},deposit:function(){var t=this;if(!this.amount)return this.$toast("请输入正确的数量"),!1;var a=parseFloat(this.amount),s=1e8*parseInt(a);this.$store.dispatch("contract/depositAccount",s).then((function(a){t.$toast("充值成功")})),this.$router.go(-1)},withdraw:function(){var t=this;if(!this.amount)return this.$toast("请输入正确的数量"),!1;var a=parseFloat(this.amount),s=1e8*parseInt(a);this.$store.dispatch("contract/withdrawAccount",s).then((function(a){t.$toast("提现成功")})),this.$router.go(-1)}}},o=i,c=(s("5931"),s("2877")),r=Object(c["a"])(o,n,e,!1,null,"f0e82852",null);a["default"]=r.exports}}]);
//# sourceMappingURL=chunk-113dd4df.f87c9472.js.map