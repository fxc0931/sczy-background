import axios from 'axios'

axios.defaults.timeout = 100000
//  响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//  配置请求头
axios.defaults.baseURL = 'https://arcane-journey-61257.herokuapp.com/api'
//  配置接口地址

// //  返回状态判断(添加响应拦截器)
// axios.interceptors.response.use((res) => {
//   //  对响应数据做些事
//   if (!res.data.success) {
//     return Promise.resolve(res)
//   }
//   return res
// }, (error) => {
//   console.log('网络异常')
//   return Promise.reject(error)
// })

// 返回一个Promise(发送get请求)
export function fetchGet (url, param) {   
  return new Promise((resolve, reject) => {
    axios.get(url, {params: param})
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 返回一个Promise(发送post请求)
export function fetchPost (url, data) {   
    return new Promise((resolve, reject) => {
      axios.post(url, data)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // 返回一个Promise(发送delete请求)
export function fetchDelete (url, data) {   
    return new Promise((resolve, reject) => {
      axios.delete(url, data)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

 // 返回一个Promise(发送delete请求)
export function fetchPut (url, data) {   
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  fetchGet,
  fetchPost,
  fetchDelete,
  fetchPut,
  axios
}
