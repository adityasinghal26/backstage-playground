import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const githubCodespacesPlugin = createPlugin({
  id: 'github-codespaces',
  routes: {
    root: rootRouteRef,
  },
});

export const GithubCodespacesPage = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
