import ins from "../utils/request";

//加载聊天用户角色列表
export const loadUserRoles = () => {
    return ins.request({
        url: '/blog/chatgpt/roles',
        method: 'get'
    })
}

//加载chatgpt配置
export const loadChatgptConfig = () => {
    return ins.request({
        url: '/blog/chatgpt/system/config',
        method: 'get'
    })
}

//加载chatgpt 聊天列表
export const loadChatgptList = () => {
    return ins.request({
        url: '/blog/chatgpt/conversations',
        method: 'get'
    })
}

//获取socket.io 连接
export const getSocketIoConnection = () => {
    return ins.request({
        url: '/blog/connection',
        method: 'get'
    })
}

//获取 token数目
export const getChatTokens = (text, model) => {
    return ins.request({
        url: '/blog/chatgpt/tokens',
        method: 'get',
        params: {
            text: text,
            model: model
        }
    })
}

//加载聊天记录
export const loadChatHistory = (chatId) => {
    return ins.request({
        url: '/blog/chatgpt/history/' + chatId,
        method: 'get',
    })
}

//更新聊天
export const uploadChat = (chatId, title) => {
    return ins.request({
        url: '/blog/chatgpt',
        method: 'put',
        data: {
            id: chatId,
            title: title
        }
    })
}

//删除聊天
export const deleteChat = (chatId) => {
    return ins.request({
        url: '/blog/chatgpt/conversation/' + chatId,
        method: 'get'
    })
}

//清除聊天记录
export const clearChatgpt = () => {
    return ins.request({
        url: '/blog/chatgpt/conversation/clear',
        method: 'delete'
    })
}

export const stopGenerate = () => {
    return ins.request({
        url: '/blog/chatgpt/stop',
        method: 'post'
    })
}






