import { Content, Header, Page } from '@backstage/core-components';
import {
    HomePageStarredEntities,
  } from '@backstage/plugin-home';
  import { HomePageSearchBar } from '@backstage/plugin-search';
import { SearchContextProvider } from "@backstage/plugin-search-react";
import { makeStyles } from "tss-react/mui";
import { Box } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles()(theme => ({
    img: {
      height: '40px',
      width: 'auto',
    },
    searchBar: {
      display: 'flex',
      maxWidth: '60vw',
      boxShadow: theme.shadows.at(1),
      borderRadius: '50px',
      margin: 'auto',
    },
    title: {
      'div > div > div > div > p': {
        textTransform: 'uppercase',
      },
    },
    notchedOutline: {
      borderStyle: 'none!important',
    },
  }));
  
  export const HomePage = () => {
    const { classes } = useStyles();
  
    return (
      <SearchContextProvider>
        <Page themeId="home">
          <Header title="Welcome back!" />
          <Content>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gridGap: 2,
              }}
            >
              {/* useStyles has a lower precedence over mui styles hence why we need to use css */}
              <HomePageSearchBar
                classes={{
                  root: classes.searchBar,
                }}
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                placeholder="Search"
              />
              <Grid container>
                <Grid item xs={12} md={5}>
                  <HomePageStarredEntities />
                </Grid>
              </Grid>
            </Box>
          </Content>
        </Page>
      </SearchContextProvider>
    );
  };