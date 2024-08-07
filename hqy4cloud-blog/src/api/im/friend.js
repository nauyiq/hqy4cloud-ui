//添加好友
import axios from "@/utils/request";

//获取用户信息
export const getUserInfoById = (userId) => {
    return axios.request({
        url: '/im/user/' + userId,
        method: 'get'
    })
}

export const allFriend = (data) => {
    return axios.request({
        url: '/im/friends',
        method: 'get',
        params: data
    })
}

export const addFriend = (data) => {
    return axios.request({
        url: '/im/friend/application',
        method: 'post',
        data: data
    })
}

//删除好友
export const deleteFriend = (data) => {
    return axios.request({
        url: '/im/friend/' + data,
        method: 'delete'
    })
}

//修改好友备注
export const setFriendMark = (data) => {
    return axios.request({
        url: '/im/friend',
        method: 'put',
        data: data
    })
}

//获取好友申请列表
export const getFriendApplications = () => {
    return axios.request({
        url: '/im/friend/applications',
        method: 'get'
    })
}

// 接收或者拒绝好友申请
export const acceptOrRejectImFriend = (data) => {
    return axios.request({
        url: '/im/friend/application',
        method: 'put',
        data: data
    })
}

//查询用户
export const searchImUsers = (name) => {
    return axios.request({
        url: '/im/user/search',
        method: 'get',
        params: {
            name: name
        }
    })
}

