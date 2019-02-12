const getters = {
  // mian
  lang: state => state.main.lang,
  currentTab: state => state.main.currentTab,
  tabs: state => state.main.tabs,
  closedTabs: state => state.main.closedTabs,

  // user
  operatorName: state => state.user.user.operatorname,

  // permission
  menus: state => state.permission.menus,
  routesInfo: state => state.permission.routesInfo,
  routesMap: state => state.permission.routesMap,
  containerRoutes: state => state.permission.containerRoutes
}

export default getters
