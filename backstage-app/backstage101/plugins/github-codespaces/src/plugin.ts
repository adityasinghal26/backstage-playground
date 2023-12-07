import { configApiRef, createApiFactory, createPlugin, createRoutableExtension, githubAuthApiRef } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { githubCodespacesApiRef, GithubCodespacesApiClient } from './api';

export const githubCodespacesPlugin = createPlugin({
  id: 'github-codespaces',
  apis: [
    createApiFactory({
      api: githubCodespacesApiRef,
      deps: { configApi: configApiRef , githubAuthApi: githubAuthApiRef },
      factory: ({ configApi, githubAuthApi }) => new GithubCodespacesApiClient({configApi, githubAuthApi})
    })
  ],
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
