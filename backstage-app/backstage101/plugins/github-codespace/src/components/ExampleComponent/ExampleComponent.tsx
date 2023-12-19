import React from 'react';
import { 
  // Typography, 
  Grid } from '@material-ui/core';
import {
  // InfoCard,
  Header,
  Page,
  Content,
  // ContentHeader,
  // HeaderLabel,
  // SupportButton,
} from '@backstage/core-components';
// import { ExampleFetchComponent } from '../ExampleFetchComponent';
// import { GithubCodespacesListCard } from '../GithubCodespacesList';

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="GitHub Codespaces" subtitle="List of your GitHub Codespaces ">
      {/* <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Experimental" /> */}
    </Header>
    <Content>
      {/* <ContentHeader title="Plugin title">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader> */}
      <Grid container spacing={3} direction="column">
        {/* <Grid item>
          <InfoCard title="Information card">
            <Typography variant="body1">
              All content should be wrapped in a card like this.
            </Typography>
          </InfoCard>
        </Grid>
        <Grid item>
          <ExampleFetchComponent />
        </Grid> */}
        {/* <Grid item>
          <GithubCodespacesListCard />
        </Grid> */}
      </Grid>
    </Content>
  </Page>
);
