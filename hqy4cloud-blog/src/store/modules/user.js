import {setToken, setRefreshToken} from '@/utils/auth'
import {getStore, setStore} from '@/utils/store'
import {
    loginByUsername,
    loginByEmail,
    getUserInfo,
    logout,
    refreshToken,
    getImUserSetting,
    updateImUserSetting
} from '@/api/user'
const user = {
    state: {
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || [],
        roles: [],
        menuAll: getStore({name: 'menuAll'}) || [],
        access_token: getStore({
            name: 'access_token'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || '',
        use_refresh_token: getStore({
            name: 'use_refresh_token'
        }) || '',
        socketAction: getStore({
            name: 'socket_action'
        }) || {},
        contactId: 0,
        contactSync: '',
        unread: getStore({
            name: 'unread'
        }) || 0,
        systemUnread: 0,
        showFriendDialog: '',
        refreshApplication: '',
        setting: getStore({
            name: 'setting'
        }) || {
            "sendKey":1
        },
        globalConfig:[], // 全局配置
        //好友列表 通讯录列表
        friends: getStore({
            name: 'friends'
        }) || [],
        // 联系人
        allContacts: getStore({
            name: 'contacts'
        }) || [],
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                loginByUsername(userInfo.username, userInfo.password).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //根据邮箱登录
        LoginByEmail({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                loginByEmail(userInfo.email, userInfo.code).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 根据手机号登录
        /*LoginByPhone({ commit }, smsForm) {
          return new Promise((resolve, reject) => {
            loginByMobile(smsForm).then(response => {
              const data = response.data
              commit('SET_ACCESS_TOKEN', data.access_token)
              commit('SET_REFRESH_TOKEN', data.refresh_token)
              commit('CLEAR_LOCK')
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        },*/
        // 刷新token
        RefreshToken({commit, state}) {
            return new Promise((resolve, reject) => {
                refreshToken(state.refresh_token).then(response => {
                    const data = response.data
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 查询用户信息
        GetUserInfo({commit}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data.data || {}
                    commit('SET_USER_INFO', data)
                    resolve(data)
                }).catch(() => {
                    reject()
                })
            })
        },
        //获取用户设置
        GetUserSetting({commit}) {
            return new Promise((resolve, reject) => {
                getImUserSetting().then((res) => {
                    const data = res.data.data || {}
                    if (!data.sendKey) {
                        data["sendKey"] = 1
                    }
                    commit('SET_SETTING', data)
                    resolve(data)
                }).catch(() => {
                    reject()
                })
            })
        },
        //修改用户设置
        UpdateUserImSetting({commit}, data) {
            return new Promise((resolve, reject) => {
                updateImUserSetting(data).then(res => {
                    let result;
                    if (res.data.code === 0) {
                        result = data
                        result["sendKey"] = 1
                    } else {
                        result = {}
                    }
                    commit('SET_SETTING', result)
                    resolve(result)
                }).catch(() => {
                    reject()
                })
            })
        },

        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_MENUALL_NULL', [])
                    commit('SET_MENU', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_SETTING', {})
                    commit('INIT_FRIENDS', {})
                    commit('UPDATE_UNREAD', 0)
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG')
                    commit('CLEAR_LOCK')
                    commit('SET_SOCKET_ACTION', {"event": 'logout', "data": null})
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_MENU', [])
                commit('SET_MENUALL_NULL', [])
                commit('SET_PERMISSIONS', [])
                commit('SET_USER_INFO', {})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                commit('CLEAR_LOCK')
                resolve()
            })
        },
    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token
            setToken(access_token)
            setStore({
                name: 'access_token',
                content: state.access_token,
                // type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setRefreshToken(rfToken)
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                // type: 'session'
            })
        },
        SET_USER_REFRESH_TOKEN: (state, rfToken) => {
            state.use_refresh_token = rfToken
            setStore({
                name: 'use_refresh_token',
                content: state.use_refresh_token,
                // type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: userInfo,
                // type: 'session'
            })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_SOCKET_ACTION: (state, data) => {
            state.socketAction = data
            setStore({
                name: 'socket_action',
                content: data
            })
        },
        SET_CHAT: (state, data) => {
            state.contactId = data
            state.contactSync = Math.random().toString(36).substr(-8);
        },
        SET_SETTING(state, data) {
            state.setting = data
            setStore({
                name: 'setting',
                content: data,
                // type: 'session'
            })
        },
        INIT_CONTACTS: (state, data) => {
            state.allContacts = data;
            setStore({
                name: 'contacts',
                content: data,
                // type: 'session'
            })
        },
        INIT_FRIENDS: (state, data) => {
            state.friends = data;
            setStore({
                name: 'friends',
                content: data,
                // type: 'session'
            })
        },
        UPDATE_UNREAD: (state, data) => {
            state.unread = data
            setStore({
                name: 'unread',
                content: data,
                // type: 'session'
            })
        },
        UPDATE_SYSTEM_UNREAD: (state, data) => {
            state.systemUnread = data
        },
        OPEN_CHAT:(state, data) => {
            state.contactId = data
            state.contactSync = Math.random().toString(36).substr(-8);
        },
        SET_FRIEND_DIALOG: (state, data) => {
            state.showFriendDialog = data
        },
        REFRESH_APPLICATIONS: (state, data) => {
            state.refreshApplication = data
        }
    }

}
export default user
