import React from 'react';
import { 
  Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { GithubCodespacesPageComponent } from './GithubCodespacesPageComponent';

export const GithubCodespacesPage = () => (
  <Page themeId="tool">
    <Header title="GitHub Codespaces" subtitle="List of your GitHub Codespaces " />
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <GithubCodespacesPageComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
