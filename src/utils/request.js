/** axios package
 * Request interception, corresponding interception, unified error handling
 */
import axios from 'axios'
import QS from 'qs'
import { Toast } from 'vant'
import router from '../router/index'
import store from '../store/index'
import cfg from '../config'

// Environment switch
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = cfg.server.development
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = cfg.server.debug
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = cfg.server.production
}

// Request timeout
axios.defaults.timeout = 10000

// post request header
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.get['Cache-Control'] = 'no-cache'

// Request interceptor
axios.interceptors.request.use(
  config => {
    // Before each request is sent, determine whether there is a token. If it exists, the token will be added to the header of the http request. There is no need to manually add it for each request.
    // Even if there is a token locally, it is possible that the token is expired, so the return status should be judged in the response interceptor
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  })

// Response interceptor
axios.interceptors.response.use(
  response => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // When the server status code is not 200
  error => {
    if (error.response.status) {
      return Promise.reject(error.response)
    }
  }
)
/**
  * getMethod, corresponding to get request
 * @param {String} url [Requested url address]
  * @param {Object} params [Parameters carried in the request]
  */
export function get (url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
/**
  * post method, corresponding to post request
 * @param {String} url [Requested url address]
  * @param {Object} params [Parameters carried in the request]
 * @param config
  */
export function post (url, params, config = null) {

  return new Promise((resolve, reject) => {
    if(config) {
      axios.post(url, params, config)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    }else {
      axios.post(url, QS.stringify(params))
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.data)
        })
    }
  })
}
