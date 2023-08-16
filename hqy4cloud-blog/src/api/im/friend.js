//添加好友
import axios from "@/utils/request";

export const allFriend = (data) => {
    return axios.request({
        url: '/im/user/friends',
        method: 'get',
        params: data
    })
}

export const addFriend = (data) => {
    return axios.request({
        url: '/chat/friend',
        method: 'post',
        data: data
    })
}

//删除好友
export const deleteFriend = (data) => {
    return axios.request({
        url: '/chat/friend/' + data,
        method: 'delete'
    })
}

//修改好友备注
export const setFriendMark = (data) => {
    return axios.request({
        url: '/chat/friend/mark',
        method: 'post',
        data: data
    })
}