import Vue from 'vue';
import Root from './app/Root.vue';

import './index.scss';
require('jquery');
global.Tether = require('tether');
require('bootstrap/dist/js/bootstrap.js');

// export default new Vue({
//   el: '#root',
//   render(h) {
//     return h(Root);
//   }
// });

import VueRouter from 'vue-router';
Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Root
    },
    {
      path: '/:itemName',
      name: 'itemPage',
      component: Root
    }
  ]
});

export default new Vue({
  el: '#root',
  router,
  render: h => h('router-view')
});
