import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { githubCodespacesPlugin, GithubCodespacesPage } from '../src/plugin';

createDevApp()
  .registerPlugin(githubCodespacesPlugin)
  .addPage({
    element: <GithubCodespacesPage />,
    title: 'Root Page',
    path: '/github-codespaces'
  })
  .render();
