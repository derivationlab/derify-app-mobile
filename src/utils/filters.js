import Vue from 'vue'
import { fck } from './utils'

Vue.filter('fck', (value, pow, bit) => {
  return fck(value, pow, bit)
})
