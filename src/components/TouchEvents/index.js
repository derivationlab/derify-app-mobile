/**
 * vue touch events
 * @param el
 * @param binding
 * @param type
 * @param vnode
 */

function getDistance(p1, p2) {
  var x = p2.pageX - p1.pageX
  var y = p2.pageY - p1.pageY;
  return Math.sqrt((x * x) + (y * y));
}

function vueTouch(el,binding,type,vnode){
  this.obj=el;
  this.binding=binding;
  this.touchType=type;
  this.startTouches=[];
  this.moveTouches = [];
  this.vueMoves=true;
  this.vueLeave=true;
  this.longTouch=true;
  this.vueCallBack=binding.value;
  this.obj.addEventListener("touchstart",(e)=>{
    this.start(e);
  },false);

  this.obj.addEventListener("touchend",(e)=>{
    this.end(e);
  },false);

  this.obj.addEventListener("touchmove",(e)=>{
    this.move(e);
  },false);
  // vnode.key = this.randomString()

}


vueTouch.prototype={
  start:function(e){
    this.vueMoves=true;
    this.vueLeave=true;
    this.longTouch=true;
    this.startTouches=e.changedTouches;
    this.moveTouches=e.changedTouches;
    this.moveToucheEvent=e;
    this.startEvent=e;
  },
  end:function(e){
    if(this.startTouches.length < 1){
      return;
    }

    var endTouches = e.changedTouches;
    if(this.startTouches.length > 1){
      var startDistance = getDistance(this.startTouches[0], this.startTouches[1]);
      var endDistance = getDistance(endTouches[0], endTouches[1]);

      var distanceDiff = endDistance - startDistance;

      if(distanceDiff < -10){
        this.touchType=="zoomin" && this.vueCallBack(e, this.startEvent, distanceDiff);
      }else if(distanceDiff > 10){
        this.touchType=="zoomout" && this.vueCallBack(e, this.startEvent, distanceDiff);
      }
    }else{
      var dragDistance = getDistance(this.startTouches[0], endTouches[0]);

      if(dragDistance > 10){
        this.touchType=="drag" && this.vueCallBack(e, this.startEvent, dragDistance);
      }
    }

    this.startTouches = [];
  },
  move:function(e){
    this.vueMoves=false;

    var endTouches = e.changedTouches;
    if(this.moveTouches.length < 1){
      this.moveToucheEvent=e;
      this.moveTouches=endTouches;
      return;
    }

    if(this.moveTouches.length > 1){
      var startDistance = getDistance(this.moveTouches[0], this.moveTouches[1]);
      var endDistance = getDistance(endTouches[0], endTouches[1]);

      var distanceDiff = endDistance - startDistance;

      if(distanceDiff < -10){
        this.touchType=="zoomin" && this.vueCallBack(e, this.moveToucheEvent, distanceDiff);
      }else if(distanceDiff > 10){
        this.touchType=="zoomout" && this.vueCallBack(e, this.moveToucheEvent, distanceDiff);
      }
    }else if(this.startTouches.length > 0){
      var dragDistance = getDistance(this.moveTouches[0], endTouches[0]);

      if(dragDistance > 10){
        this.touchType=="drag" && this.vueCallBack(e, this.moveToucheEvent, dragDistance);
      }
    }

    this.moveToucheEvent=e;

    this.moveTouches=endTouches;
  },
  randomString:function(){
    var len = 10;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
};

export default {
  install: function (Vue, options) {
    Vue.directive("zoomin",{
      bind:function(el,binding,vnode){
        new vueTouch(el,binding,"zoomin",vnode);
      }
    });
    Vue.directive("zoomout",{
      bind:function(el,binding,vnode){
        new vueTouch(el,binding,"zoomout",vnode);
      }
    });
    Vue.directive("drag",{
      bind:function(el,binding,vnode){
        new vueTouch(el,binding,"drag",vnode);
      }
    });
  }
}
