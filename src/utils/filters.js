import Vue from 'vue'
import { fck, dfv, amountFormt } from './utils'

Vue.filter('fck', (value, pow, bit) => {
  return fck(value, pow, bit)
})

Vue.filter('dfv', (value, defaultValue) => {
  return dfv(value, defaultValue)
})

Vue.filter('amountFormt', (value, bit, showPositive, zeroDefault, shiftNum) => {
  return amountFormt(value, bit, showPositive, zeroDefault, shiftNum)
})

Vue.filter('textwrap', (value, length) => {
  if(value.length <= length) {
    return value
  }

  return value.substring(0, length) + "..."
})
