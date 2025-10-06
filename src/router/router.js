import {Router} from '@vaadin/router';

let router;

export function initRouter(outlet) {
  router = new Router(outlet);

  router.setRoutes([
    {
      path: '/',
      redirect: '/employees',
    },
    {
      path: '/employees',
      component: 'employee-list',
      action: async () => {
        await import('../components/employee-list.js');
      },
    },
    {
      path: '/employees/new',
      component: 'employee-form',
      action: async () => {
        await import('../components/employee-form.js');
      },
    },
    {
      path: '/employees/:id/edit',
      component: 'employee-form',
      action: async () => {
        await import('../components/employee-form.js');
      },
    },
    {
      path: '(.*)',
      component: 'not-found',
      action: async () => {
        await import('../components/not-found.js');
      },
    },
  ]);

  return router;
}

export function getRouter() {
  return router;
}

export function navigateTo(path) {
  if (router) {
    Router.go(path);
  }
}
