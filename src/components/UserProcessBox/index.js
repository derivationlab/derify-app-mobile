import OpenStatus from './OpenStatus'
import Vue from 'vue'

const UserProcessBox = Vue.extend(OpenStatus);

const context = {
  instance: null
}

UserProcessBox.install = function (i18n, {status, msg}) {

  if(!context.instance){
    UserProcessBox.prototype._i18n = i18n
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
    context.instance.updateData({
      show: status > 0,
      status,
      msg
    })
  }

  return context.instance
}

export default UserProcessBox
