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
        url: '/im/user/friends',
        method: 'get',
        params: data
    })
}

export const addFriend = (data) => {
    return axios.request({
        url: '/im/user/friend',
        method: 'post',
        data: data
    })
}

//删除好友
export const deleteFriend = (data) => {
    return axios.request({
        url: '/im/user/friend/' + data,
        method: 'delete'
    })
}

//修改好友备注
export const setFriendMark = (data) => {
    return axios.request({
        url: '/im/user/friend/mark',
        method: 'post',
        data: data
    })
}