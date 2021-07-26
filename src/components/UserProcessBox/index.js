import OpenStatus from './OpenStatus'
import Vue from 'vue'

const UserProcessBox = Vue.extend(OpenStatus);
const context = {
  instance: null
}
UserProcessBox.install = function ({status, msg}) {

  if(!context.instance){
    context.instance = new UserProcessBox({
      data: {
        show: status > 0,
        status,
        msg
      }
    }).$mount()

    document.body.appendChild(context.instance.$el)

    Vue.nextTick(() => {
      context.instance.visible = false
    })
  }else{
    console.log(context.instance)
    context.instance.updateData({
      show: status > 0,
      status,
      msg
    })
  }

  return context.instance
}

export default UserProcessBox
