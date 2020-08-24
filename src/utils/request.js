/**
 * http配置
 */
import axios from 'axios'

/**
 * 跳转登录方法
 * @param loginUrl
 */
export const goLogin = (loginUrl = '') => {
  if (!loginUrl) return
  const wlh = window.location.href.indexOf('?') === -1
    ? encodeURI(`${window.location.href}?to=1`)
    : encodeURI(`${window.location.href}&to=1`)
  const url = `${loginUrl}${
    loginUrl.indexOf('?') === -1 ? '?' : '&'
  }returnUrl=${encodeURIComponent(wlh)}`
  console.log('=====goLogin--url=====\n', url)
  window.location.href = url
}

// 超时时间
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  Accept: 'application/json',
}
axios.defaults.timeout = 5 * 60 * 100000
axios.defaults.baseURL = '/'
// 请求携带cookie
axios.defaults.withCredentials = true
// http请求拦截器
// 添加时间戳 防止缓存
axios.interceptors.request.use(
  (request) => {
    const config = request
    const url = `/${config.url}`
    config.url = `${url}`
    if (config.method.toLowerCase() === 'get') {
      const t = new Date().getTime()
      config.url = `${url}${url.indexOf('?') === -1 ? '?' : '&'}t=${t}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 统一处理结果
axios.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.status === 'notLogin') { // 用户未登录，调用登录方法
      goLogin(data.data)
    } else {
      return data
    }
  },
  (error) => { // 跳转错误页
    console.log('axios error', error)
    return Promise.reject(error)
  },
)

axios.oGet = (url, params) => axios.get(url, {
  params,
})
export { axios as http }
export default axios
