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
      import('./components/GithubCodespacesEntityTab').then(m => m.GithubCodespaceEntityContent),
    mountPoint: rootRouteRef,
  }),
);


export const GithubCodespacesPageExample = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesPageExample',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);

export const GithubCodespacesListCard = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesListCard',
    component: () => 
      import('./components/GithubCodespacesList').then(m => m.GithubCodespacesListCard),
    mountPoint: rootRouteRef,
  }),
);

export const GithubCodespacesInRepoListCard = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesInRepoListCard',
    component: () => 
      import('./components/GithubCodespacesInRepoList').then(m => m.GithubCodespacesInRepoListCard),
    mountPoint: rootRouteRef,
  }),
);

export const GithubCodespacesEntityCard = githubCodespacesPlugin.provide(
  createRoutableExtension({
    name: 'GithubCodespacesEntityCard',
    component: () => 
      import('./components/GithubCodespacesEntityCard').then(m => m.GithubCodespacesEntityCard),
    mountPoint: rootRouteRef,
  })
)