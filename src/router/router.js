import {Router} from '@vaadin/router';

export function initRouter(outlet) {
  const router = new Router(outlet);

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
