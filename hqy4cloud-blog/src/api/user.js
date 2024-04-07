import axios from '../utils/request'
import qs from "qs"
import md5 from "js-md5"
import auth from '@/const/auth'


const scope = 'all'

// 登录
export const loginByUsername = (username, password) => {
    const grant_type = 'password'
    password = md5(password)
    return axios.request({
        url: '/oauth2/token',
        headers: {
            isToken: false,
            Authorization: auth['password']
        },
        method: 'post',
        data: qs.stringify({username, password, grant_type, scope})
    })
}

// 登录邮箱
export const loginByEmail = (email, code) => {
    const grant_type = 'email'
    return axios.request({
        url: '/oauth2/token',
        headers: {
            isToken: false,
            Authorization: auth['password']
        },
        method: 'post',
        data: qs.stringify({email, code, grant_type, scope})
    })
}

//校验token是否有效
export const checkTokenEnable = (access_token) => {
    return axios.request({
        url: '/auth/' + access_token,
        method: 'get',
        headers: {
            isToken: false,
            Authorization: auth['password']
        }
    })
}


//刷新token
export const refreshToken = (refresh_token) => {
    const grant_type = 'refresh_token'
    return axios.request({
        url: '/oauth2/token',
        headers: {
            isToken: false,
            Authorization: auth['password']
        },
        method: 'post',
        params: {refresh_token, grant_type, scope}
    });
}

export const logout = () => {
    return axios.request({
        url: '/auth/logout',
        method: 'delete'
    })
}


// 发送邮件
export const sendEmail = (email) => {
    return axios.request({
        url: 'blog/email/' + email,
        method: 'post',
        headers: {
            isToken: false,
        }
    })
}


// 忘记密码
export const resetPassword = (usernameOrEmail, password, code) => {
    password = md5(password)
    return axios.request({
        url: '/blog/account/password/forget',
        method: 'post',
        headers: {
            isToken: false,
        },
        data: {usernameOrEmail, password, code}
    })
}

// 发送注册邮件
export const sendRegistryEmail = (email) => {
    return axios.request({
        url: 'blog/email/registry/' + email,
        method: 'post',
        headers: {
            isToken: false,
        }
    })
}

// 注册
export const registry = (username, email, password, code) => {
    password = md5(password)
    return axios.request({
        url: '/blog/user/registry',
        method: 'post',
        headers: {
            isToken: false,
        },
        data: {username, email, password, code}
    })
}


//修改密码
export const updatePassword = (oldPassword, newPassword) => axios.put('/blog/user/password', qs.stringify({
    oldPassword: md5(oldPassword),
    newPassword: md5(newPassword)
}))

//上传头像
export const uploadAvatar = (formData) => {
    return axios.request({
        url: '/blog/upload/avatar',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    })
}


// 获取个人信息
export const getUserInfo = () => axios.get('/blog/user/profile')

//获取im用户配置
export const getImUserSetting = () =>  axios.get('/im/user/setting')

//修改im用户配置
export const updateImUserSetting = (data) => {
    return axios.request({
        url: '/im/user/setting',
        method: 'put',
        data: data
    })

}



// 修改用户信息
export const updateUserInfo = data => axios.put('/im/user', data)


// 获取管理员的个人信息，必须在数据库里面id为 **1**
export const getAboutMe = () => axios.get('/blog/aboutMe')


