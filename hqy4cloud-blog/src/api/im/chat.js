import ins from "@/utils/request";

//获取socket.io 连接
export const getSocketIoConnection = () => {
    return ins.request({
        url: '/chat/connection',
        method: 'get'
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
        url: '/im/message',
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
export const setChatTop = (data) => {
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

//获取联系人列表
export const getContacts = () => {
    return ins.request({
        url: '/chat/contacts',
        method: 'get'
    })
}

//上传文件
export const uploadFile = (file) => {
    return ins.request({
        url: '/chat/upload',
        method: 'post',
        data: file
    })
}










