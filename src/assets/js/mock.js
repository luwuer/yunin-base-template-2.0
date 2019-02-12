const mock =
{
  menus: [
    {
      level: 1,
      type: 1, // 类型。 1：菜单（要显示的菜单）； 0：功能（菜单下的增删改查等）；
      title: '一级菜单', // 菜单描述，菜单要显示的文字
      url: '/2', // 菜单对应的前端文件 [后台配置]
      code: '2', // 菜单的唯一标识 [不可重复]
      icon: 'icon-caidan-', // 菜单要显示的图标
      expand: false, // 菜单是否展开
      children: []
    },
    {
      level: 1, // 菜单类型拥有level表示菜单拥有几层子菜单
      type: 1, // 类型。 1：菜单（要显示的菜单）； 0：功能（菜单下的增删改查等）；
      title: '二级菜单', // 菜单描述，菜单要显示的文字
      code: '3', // 菜单的唯一标识 [不可重复]
      icon: 'icon-caidan-', // 菜单要显示的图标
      expand: false, // 菜单是否展开
      children: [
        {
          level: 2,
          type: 1,
          title: '二 · 一',
          url: '/3/1',
          code: '31',
          expand: false,
          children: []
        },
        {
          level: 2,
          type: 1,
          title: '二 · 二',
          url: '/3/2',
          code: '32',
          expand: false,
          children: []
        },
        {
          level: 2,
          type: 1,
          title: '二 · 三',
          url: '/3/3',
          code: '33',
          expand: false,
          children: []
        }
      ]
    }
  ]
}

export default mock
