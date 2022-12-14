import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/WindowMain/Chat' },
  {
    path: '/WindowMain',
    component: () => import('./Window/WindowMain.vue'),
    children: [
      {
        path: 'Chat',
        component: () => import('./Window/WindowMain/Chat.vue')
      },
      {
        path: 'Contact',
        component: () => import('./Window/WindowMain/Contact.vue')
      },
      {
        path: 'Collection',
        component: () => import('./Window/WindowMain/Collection.vue')
      }
    ]
  },
  {
    path: '/WindowSetting',
    component: () => import('./Window/WindowSetting.vue'),
    children: [
      {
        path: 'AccountSetting',
        component: () => import('./Window/WindowSetting/AccountSetting.vue')
      }
    ]
  },
  {
    path: '/WindowUserInfo',
    component: () => import('./Window/WindowUserInfo.vue')
  },
  {
    path: '/WindowTest',
    component: () => import('./Window/WindowTest.vue')
  }
];

export let router = createRouter({
  routes,
  history: createWebHistory()
});
