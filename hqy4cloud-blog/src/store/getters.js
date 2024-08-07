
const getters = {
  tag: state => state.tags.tag,
  website: state => state.common.website,
  language: state => state.common.language,
  userInfo: state => state.user.userInfo,
  themeName: state => state.common.themeName,
  isMacOs: (state, getters) => getters.themeName === 'mac-os',
  isRefresh: state => state.common.isRefresh,
  isSearch: state => state.common.isSearch,
  isHorizontal: state => state.common.setting.sidebar === 'horizontal',
  isCollapse: state => state.common.isCollapse,
  isLock: state => state.common.isLock,
  isFullScren: state => state.common.isFullScren,
  isMenu: state => state.common.isMenu,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagsKeep: (state, getters) => {
    return getters.tagList.filter(ele => {
      return ele.meta.keepAlive
    }).map(ele => ele.value)
  },
  tagWel: state => state.tags.tagWel,
  access_token: state => state.user.access_token,
  refresh_token: state => state.user.refresh_token,
  use_refresh_token: state => state.user.use_refresh_token,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  menuId: state => state.user.menuId,
  menu: state => state.user.menu,
  menuAll: state => state.user.menuAll,
  logsList: state => state.logs.logsList,
  logsLen: state => state.logs.logsList.length || 0,
  logsFlag: (state, getters) => getters.logsLen === 0,
  socketAction: state => state.user.socketAction,
  contactId: state => state.user.contactId,
  contactSync: state => state.user.contactSync,
  setting: state => state.user.setting,
  globalConfig: state => state.user.globalConfig,
  unread: state => state.user.unread,
  systemUnread: state => state.user.systemUnread,
  showFriendDialog: state => state.user.showFriendDialog,
  refreshApplication: state => state.user.refreshApplication
}
export default getters
