import axios from 'axios'
import {Message} from "element-ui"
import store from '@/store'
import errorCode from '@/const/errorCode'
import qs from 'qs'
const baseURL = process.env.VUE_APP_URL


const ins = axios.create({
    baseURL,
    timeout: 15000,
    withCredentials: true
})
ins.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500 // 默认的
}

//请求拦截器
ins.interceptors.request.use(req => {
    const isToken = (req.headers || {}).isToken === false
    const token = store.getters.access_token
    if (token && !isToken) {
        req.headers['Authorization'] = 'Bearer ' + token// token
    }
    if (req.method === 'get') {
        req.paramsSerializer = function(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
    return req
}, err => {
    return Promise.reject(err)
})

//响应拦截器
ins.interceptors.response.use(resp => {
    const status = Number(resp.status) || 200
    const message = resp.data.message || errorCode[status] || errorCode['default']
    const resultCode = resp.data.code

    //用户被锁定.
    if (resultCode && resultCode === 2001) {
        Message.warning(errorCode['2001'])
        store.dispatch('LogOut').then(() => {
            // 刷新登录页面，避免多次弹框
            window.location.reload()
        }).catch(() => {
        })
        return
    }

    if (resp.request.responseURL.includes("/oauth2/token")) {
        if (status === 200 && resultCode && resultCode !== 0) {
            const msg = errorCode[resultCode];
            if (msg) {
                Message.warning(msg);
                return Promise.reject(new Error(msg))
            } else {
                Message.warning(message);
                return Promise.reject(new Error(message))
            }

        }
        if (status !== 200) {
            Message.error(errorCode[resultCode])
            return Promise.reject(new Error(message))
        } else {
            return resp
        }
    }

    //针对令牌过期的特殊响应码
    if (status === 401) {
        if (!resp.request.responseURL.includes("/oauth2/token") && resultCode === 9300) {
            //尝试刷新token.
            const refreshToken = store.getters.refresh_token
            if (refreshToken) {
                store.dispatch('RefreshToken', refreshToken).then(() => {
                    window.location.reload()
                }).catch(() => {
                    store.dispatch('FedLogOut').then(()=> {
                        window.location.reload()
                    })
                })
            } else {
                store.dispatch('FedLogOut').then(()=> {
                    window.location.reload()
                })
            }
        } else {
            Message.error(message)
        }
    }


    return resp;
}, err => {
    if (err.response.status === 503) {
        Message.error(errorCode['503'])
    }
    return Promise.reject(new Error(err))
})



export const setStatus = (name) => {
    localStorage.setItem("status", name)
}

export const getStatus = () => {
    return localStorage.getItem("status");
}




export default ins

