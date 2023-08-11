import ins from "../utils/request";

//获取socket.io 连接
export const getSocketIoConnection = () => {
    return ins.request({
        url: '/chat/connection',
        method: 'get'
    })
}

//添加群聊用户
export const addGroupUser = (data) => {
    return ins.request({
        url: '/chat/group/append',
        method: 'post',
        data: data
    })
}

//移除群聊用户
export const removeGroupUser = (data) => {
    return ins.request({
        url: '/chat/group/remove',
        method: 'post',
        data: data
    })
}

//获取群聊所有用户
export const getGroupUsers = (data) => {
    return ins.request({
        url: '/chat/group/users',
        method: 'get',
        params: data
    })
}

//创建群聊
export const createGroup = (data) => {
    return ins.request({
        url: '/chat/group',
        method: 'post',
        data: data
    })
}

//删除群聊
export const deleteGroup = (data) => {
    return ins.request({
        url: '/chat/group/' + data,
        method: 'delete',
    })
}

//绑定群聊
export const bindGroup = (data) => {
    return ins.request({
        url: '/chat/group/' + data,
        method: 'delete',
    })
}

//获取群聊信息
export const getGroupInfo = (groupId) => {
    return ins.request({
        url: '/chat/group/' + groupId,
        method: 'get',
    })
}

//群聊设置
export const groupSetting = (data) => {
    return ins.request({
        url: '/chat/group/setting',
        method: 'post',
        data: data
    })
}

//修改群名
export const updateGroupName = (data) => {
    return ins.request({
        url: '/chat/group',
        method: 'put',
        data: data
    })
}

//设置某个用户为群聊的管理员
export const groupRole = (data) => {
    return ins.request({
        url: '/chat/group/role',
        method: 'put',
        data: data
    })
}


//获取聊天记录
export const getChatMessages = (params) => {
    return ins.request({
        url: '/chat/messages',
        method: 'get',
        params: params
    })
}

//发送聊天消息
export const sendChatMessage = (data) => {
    return ins.request({
        url: '/chat/message',
        method: 'post',
        data: data
    })
}

export const sendWebrtcMessage = (data) => {
    return ins.request({
        url: '/chat/webrtc',
        method: 'post',
        data: data
    })
}

//设置消息为已读
export const readMessage = (data) => {
    return ins.request({
        url: '/chat/message/read',
        method: 'put',
        data: data
    })
}

//撤回消息
export const undoChatMessage = (id) => {
    return ins.request({
        url: '/chat/message/undo/' + id,
        method: 'delete'
    })
}

//设置消息置顶
export const setChatConfig = (data) => {
    return ins.request({
        url: '/chat/top',
        data: data,
        method: 'put'
    })
}

//设置消息免打扰
export const setChatNotice = (data)  =>{
    return ins.request({
        url: '/chat/notice',
        method: 'put',
        data: data
    })
}


//发布群公告
export const publishNotice = (data) => {
    return ins.request({
        url: '/chat/group/notice',
        method: 'post',
        data: data
    })
}







