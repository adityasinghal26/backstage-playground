/*
 * Copyright 2021 Larder Software Limited
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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
// import path from 'path';
// import { pipeline } from 'node:stream';
// import fs from 'node:fs';

export const createGitPullRequestAction = () => {
    return createTemplateAction<{ 
      gitRepoUrl: string;
      authToken: string; 
      targetBranch: string; 
      title: string;
      description: string; 
    }>({
        id: 'git:pull-request:create',
        schema: {
          input: {
            required: ['gitRepoUrl','authToken', 'targetBranch', 'title', 'description'],
            type: 'object',
            properties: {
              gitRepoUrl: {
                type: 'string',
                title: 'Repository URL',
                description: 'HTTPS URL for the Git repository',
              },
                authToken: {
                type: 'string',
                title: 'Authorization Token',
                description: 'The token to use for authorization to GitHub',
              },
              targetBranch: {
                type: 'string',
                title: 'Target Branch Name',
                description: 'The target branch name of the merge request',
              },
              title: {
                type: 'string',
                title: 'Pull Request Name',
                description: 'The name for the pull request',
              },
              description: {
                type: 'string',
                title: 'Pull Request Description',
                description: 'The description for the pull request',
              }
            },
          },
          output: {
            type: 'object',
            properties: {
              targetBranchName: {
                type: 'string',
                title: 'Target branch name of the merge request',
              },
              pullRequestUrl: {
                title: 'Pull Request URL',
                type: 'string',
                description: 'Link to the pull request',
              },
              pullRequestNumber: {
                title: 'Pull Request Number',
                type: 'number',
                description: 'The pull request number',
              },
            },
          },
        },
  
      async handler(ctx) {
        
      },
    });
  };