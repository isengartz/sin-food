export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './User/register',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                authority: ['admin', 'restaurant'],
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                authority: ['admin', 'restaurant'],
                name: 'welcome',
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/menu',
                authority: ['admin', 'restaurant'],
                name: 'Menu',
                icon: 'meh',
                routes: [
                  {
                    path: '/menu/items',
                    authority: ['admin', 'restaurant'],
                    name: 'Menu Items',
                    component: './Menu',
                  },
                  {
                    path: '/menu/categories',
                    authority: ['admin', 'restaurant'],
                    icon: 'meh',
                    name: 'Categories',
                    component: './MenuCategory/',
                  },
                ],
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
