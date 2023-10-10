import ins from "@/utils/request";


//添加群聊用户
export const addGroupUser = (data) => {
    return ins.request({
        url: '/im/group/member',
        method: 'post',
        data: data
    })
}

//移除群聊用户
export const removeGroupUser = (data) => {
    return ins.request({
        url: '/im/group/member',
        method: 'delete',
        data: data
    })
}

//退出群聊
export const exitGroup = (groupId) => {
    return ins.request({
        url: '/im/group/exit/' + groupId,
        method: 'delete',
    })
}

//解散群聊
export const deleteGroup = (groupId) => {
    return ins.request({
        url: '/im/group/' + groupId,
        method: 'delete',
    })
}

//获取群聊所有用户
export const getGroupUsers = (id) => {
    return ins.request({
        url: '/im/group/members/' + id,
        method: 'get',
    })
}

//创建群聊
export const createGroup = (data) => {
    return ins.request({
        url: '/im/group',
        method: 'post',
        data: data
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
        url: '/im/group',
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

//发布群公告
export const publishNotice = (data) => {
    return ins.request({
        url: '/im/group',
        method: 'put',
        data: data
    })
}

