import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/liveData'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/liveData',
          component: () => import('../components/page/LiveDataEvaluation.vue'),
          meta: { title: '实况数据评测' }
        },
        {
          path: '/TwentyFourHourData',
          component: () => import('../components/page/TwentyFourHourDataEvaluation.vue'),
          meta: { title: '24小时预报数据评测' }
        },
        {
          path: '/FifteenDayData',
          component: () => import('../components/page/FifteenDayDataEvaluation.vue'),
          meta: { title: '15天预报数据评测' }
        },
        {
          path: '/map',
          component: () => import(/* webpackChunkName: "map" */ '../components/page/Map.vue'),
          meta: { title: '地图' }
        },
        {
          path: '/mapTest',
          component: () => import(/* webpackChunkName: "mapTest" */ '../components/page/MapTest.vue'),
          meta: { title: '地图' }
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: { title: '403' }
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
