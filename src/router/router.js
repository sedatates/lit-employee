import {Router} from '@vaadin/router';
import {getBasePath} from '../utils/base-path.js';

export function initRouter(outlet) {
  const basePath = getBasePath();
  const router = new Router(outlet, basePath ? {baseUrl: basePath} : undefined);

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
