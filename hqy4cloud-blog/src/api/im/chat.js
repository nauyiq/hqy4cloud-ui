import ins from "@/utils/request";

//获取socket.io 连接
export const getSocketIoConnection = () => {
    return ins.request({
        url: '/im/connection',
        method: 'get'
    })
}


//获取聊天记录
export const getChatMessages = (params) => {
    return ins.request({
        url: '/im/messages',
        method: 'get',
        params: params
    })
}

//删除聊天
export const getChat = (conversationId) => {
    return ins.request({
        url: "/im/conversation/" + conversationId,
        method: "get"
    })
}

//删除聊天
export const removeChat = (conversationId) => {
    return ins.request({
        url: "/im/conversation/" + conversationId,
        method: "delete"
    })
}

//发送聊天消息
export const sendChatMessage = (data) => {
    return ins.request({
        url: '/im/message',
        method: 'post',
        data: data
    })
}

//发送文件消息
export const sendfileMessage = (file) => {
    return ins.request({
        url: '/im/file/message',
        method: 'post',
        data: file
    })
}

//获取远程服务的文件
export const getServerFile = (url) => {
    return ins.request({
        url: url,
        responseType: "blob",
        method: "get"
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
        url: '/im/messages/read',
        method: 'put',
        data: data
    })
}

//撤回消息
export const undoChatMessage = (id) => {
    return ins.request({
        url: '/im/message/undo/' + id,
        method: 'put'
    })
}

//转发消息
export const forwardMessage = (data) => {
    return ins.request({
        url: '/im/message/forward',
        method: 'post',
        data: data
    })
}


//设置消息置顶
export const setChatTop = (data) => {
    return ins.request({
        url: '/im/chat/top',
        data: data,
        method: 'put'
    })
}

//设置消息免打扰
export const setChatNotice = (data)  =>{
    return ins.request({
        url: '/im/chat/notice',
        method: 'put',
        data: data
    })
}

//获取聊天列表
export const getConversations = () => {
    return ins.request({
        url: '/im/conversations',
        method: 'get'
    })
}

//获取聊天列表
export const getChats = () => {
    return ins.request({
        url: '/im/chats',
        method: 'get'
    })
}

//获取通讯录好友列表
export const getFriendContacts = () => {
    return ins.request({
        url: '/im/user/contacts',
        method: 'get'
    })
}












