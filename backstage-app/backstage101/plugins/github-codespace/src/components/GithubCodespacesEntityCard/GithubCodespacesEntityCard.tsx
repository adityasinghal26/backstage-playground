/*
 * Copyright 2023 The Kubin Kloud Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// import { useListCodespacesForUser } from "../../hooks";
import React from "react";
import { useEntity } from "@backstage/plugin-catalog-react";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Card, CardContent, CardHeader, Divider, IconButton, makeStyles } from "@material-ui/core";
import { useOpenCodespaceInEntityForUser } from "../../hooks/useOpenCodespaceInEntityForUser";
import { useListCodespaceswithEntityForUser } from "../../hooks";
import { GithubCodespaceEntityListTable } from "./GithubCodespaceEntityTable";

const useStyles = makeStyles({
  gridItemCard: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 10px)', // for pages without content header
    marginBottom: '10px',
  },
  fullHeightCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  gridItemCardContent: {
    flex: 1,
  },
  fullHeightCardContent: {
    flex: 1,
  },
});


/**
 * A Backstage Card to list the Codespaces for the Authenticated User
 * 
 * @public
 */
export const GithubCodespacesEntityCard = () => {
  const { entity } = useEntity();

  // const [owner, repo] = (
  //     entity?.metadata.annotations?.[GITHUB_CODESPACES_ANNOTATION] ?? '/'
  //     .split('/');
  // )
  const { startCodespace } = useOpenCodespaceInEntityForUser(entity);
  const { count, data, loading, error } = useListCodespaceswithEntityForUser(entity);
  const classes = useStyles();

  // const openInCodespace: IconLinkVerticalProps = {
  //   label: 'Open in Codespace',
  //   // disabled: !entitySourceLocation,
  //   icon: <GitHubIcon/>,
  //   // href: entitySourceLocation?.locationTargetUrl,
  //   // onClick: useOpenCodespaceInEntityForUser(entity),
  // };
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }


  return (
    <Card className={classes.gridItemCard}>
      <CardHeader
        title="GitHub Codespaces"
        // subheader="GitHub Codespace for the entity"
        action={
          <>
            <IconButton
              aria-label="Start"
              title="Open Codespace"
              onClick={() => startCodespace().then((result) => {
                return openInNewTab(result.web_url);
              })}
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          </>
        }
      />
      <Divider />
      <CardContent className={classes.gridItemCard}>
        <GithubCodespaceEntityListTable count={count} list={data} loading={loading} error={error} />
      </CardContent>
    </Card>
    // <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
    //   <GitHubIcon/>
    //   <Box ml={1} className={classes.subtitles}>
    //     <Typography variant="subtitle2">{name}</Typography>
    //   </Box>
    // </Box>
  );
}