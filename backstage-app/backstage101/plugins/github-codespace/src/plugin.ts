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
      import('./components/GithubCodespacesPage').then(m => m.GithubCodespacesPage),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubCodespacesContent = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesContent',
    component: () => 
      import('./components/GithubCodespacesEntityContent').then(m => m.GithubCodespaceEntityContent),
    mountPoint: rootRouteRef,
  }),
);

export const GithubCodespacesPageList = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesPageList',
    component: () => 
      import('./components/GithubCodespacesPage').then(m => m.GithubCodespacesPageComponent),
    mountPoint: rootRouteRef,
  }),
);

export const EntityGithubCodespacesCard = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'EntityGithubCodespacesCard',
    component: () => 
      import('./components/GithubCodespacesEntityCard').then(m => m.GithubCodespacesEntityCard),
    mountPoint: rootRouteRef,
  })
)