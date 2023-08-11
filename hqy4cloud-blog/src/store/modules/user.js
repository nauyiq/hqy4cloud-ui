import {setToken, setRefreshToken} from '@/utils/auth'
import {getStore, setStore} from '@/utils/store'
import {loginByUsername, loginByEmail, getUserInfo, logout, refreshToken} from '@/api/user'
const user = {
    state: {
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || [],
        roles: [],
        menu: getStore({
            name: 'menu'
        }) || [],
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
        socketAction: '',
        contactId: 0,
        unread: 0,
        contactSync: '',
        setting: {
            sendKey: "1",
            theme: "default",
            isVoice: false,
            avatarCricle: false,
            hideMessageName: false,
            hideMessageTime: false,
        },
        globalConfig:[], // 全局配置
        allContacts: [], // 联系人
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
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_MENUALL_NULL', [])
                    commit('SET_MENU', [])
                    commit('SET_PERMISSIONS', [])
                    commit('SET_USER_INFO', {})
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG')
                    commit('CLEAR_LOCK')
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
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setRefreshToken(rfToken)
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_USER_REFRESH_TOKEN: (state, rfToken) => {
            state.use_refresh_token = rfToken
            setStore({
                name: 'use_refresh_token',
                content: state.use_refresh_token,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: userInfo,
                type: 'session'
            })
        },
        SET_MENUALL: (state, menuAll) => {
            const menu = state.menuAll
            menuAll.forEach(ele => {
                if (!menu.find(item => item.label === ele.label && item.path === ele.path)) {
                    menu.push(ele)
                }
            })
            state.menuAll = menu
            setStore({name: 'menuAll', content: state.menuAll})
        },
        SET_MENUALL_NULL: (state) => {
            state.menuAll = []
            setStore({name: 'menuAll', content: state.menuAll})
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({name: 'menu', content: state.menu})
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }

            state.permissions = list
            setStore({
                name: 'permissions',
                content: list,
                type: 'session'
            })
        },
        SET_SOCKET_ACTION: (state, data) => {
            state.socketAction = data
        },
        SET_CHAT: (state, data) => {
            state.contactId = data
            state.contactSync = Math.random().toString(36).substr(-8);
        },
        SET_GLOBAL_CONFIG(state, data) {
            state.globalConfig = data;
        },
        SET_SETTING(state, data) {
            state.setting = data;
        },
        init_CONTACTS: (state, data) => {
            state.allContacts = data;
        },
        UPDATE_UNREAD: (state, data) => {
            state.unread = parseInt(data);
        },
    }

}
export default user
