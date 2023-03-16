import axios from '../utils/request'
import qs from "qs"
import md5 from "js-md5"
import ins from "../utils/request";
import auth from '@/const/auth'


const scope = 'all'

// 登录
export const loginByUsername = (username, password) => {
        const grant_type = 'password'
        password = md5(password)
        return ins.request({
                url: '/oauth2/token',
                headers: {
                        isToken: false,
                        Authorization: auth['password']
                },
                method: 'post',
                data: qs.stringify({ username, password, grant_type, scope })
        })
}


//刷新token
export const refreshToken = (refresh_token) => {
        const grant_type = 'refresh_token'
        return ins.request({
                url: '/oauth2/token',
                headers: {
                        isToken: false,
                        Authorization: auth['password']
                },
                method: 'post',
                params: { refresh_token, grant_type, scope }
        });
}

export const logout = () => {
        return ins.request({
                url: '/auth/logout',
                method: 'delete'
        })
}


// 注册
export const registry = (data) => axios.post('/blog/account/registry', data)

// 发送注册邮件
export const sendEmail = (data) => axios.post('/blog/account/registry/email', data)

// 发送忘记密码邮件
export const sendForgetPasswordEmail = (usernameOrEmail) => axios.post('/blog/account/password/email', qs.stringify({
        usernameOrEmail:usernameOrEmail
}))

// 忘记密码
export const resetPassword = (data) => axios.post('/blog/account/password/reset', data)


//修改密码
export const updatePassword = (oldPassword, newPassword) => axios.put('/blog/account/password', qs.stringify({
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)
}))

// 获取个人信息
export const getUserInfo = () => axios.get('/blog/account')

// 修改用户信息
export const updateUserInfo = data => axios.put('/blog/account/profile', data)


// 获取管理员的个人信息，必须在数据库里面id为 **1**
export const getAboutMe = () => axios.get('/blog/aboutMe')


