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
import { simpleGit } from 'simple-git';
// import path from 'path';
// import { pipeline } from 'node:stream';
import uuid from 'uuid';
import fs from 'node:fs';
import { cloneGitRepo, 
  commitAndPushGitChanges, 
  copyGitChanges, 
  createAndCheckoutBranch, 
  createPullRequest, 
  removeHttpsFromUrl 
} from './helpers';

export const createGitPullRequestAction = () => {
    return createTemplateAction<{ 
      gitRepoUrl: string;
      authToken: string; 
      targetBranch: string; 
      title: string;
      description: string; 
      sourcePath: string;
      targetPath: string;
      commitMessage: string;
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
              },
              sourcePath: {
                type: 'string',
                title: 'Working Subdirectory',
                description: 'Subdirectory of working directory to copy changes from',
              },
              targetPath: {
                type: 'string',
                title: 'Repository Subdirectory',
                description: 'Subdirectory of repository to apply changes to',
              },
              commitMessage: {
                type: 'string',
                title: 'Commit Message',
                description: 'Commit message in the Git repository',
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
        const { input } = ctx;
        const { gitRepoUrl, authToken, targetBranch, title, description, commitMessage } = input;
        const { sourcePath, targetPath } = input;

        const gitRepoWithoutHttps = await removeHttpsFromUrl(gitRepoUrl);
        const [domain, orgName, ...rest] = gitRepoWithoutHttps.split('/');

        const git = simpleGit();
        const user = `${orgName}`;

        const fullSourcePath = `${ctx.workspacePath}/${sourcePath}`;
        const fullTargetPath =`${ctx.workspacePath}/${targetPath}`;
        const sourceBranch = `'backstage-'${uuid.v4()}`;
        const finalCommitMessage = commitMessage.length !== 0  ? commitMessage : 'first commit!';

        console.log('Git URL without HTTPS: ', gitRepoWithoutHttps);

        const remoteUrl = `https://${user}:${authToken}@${gitRepoWithoutHttps}`;

        await cloneGitRepo(git, remoteUrl);

        // await copyGitChanges(fs,fullSourcePath,fullTargetPath);

        await createAndCheckoutBranch(git,sourceBranch);

        await commitAndPushGitChanges(git, './*', finalCommitMessage, sourceBranch);

        const { targetBranchName, pullRequestUrl, pullRequestId} 
              =  await createPullRequest(gitRepoWithoutHttps, authToken, sourceBranch, 
                                  targetBranch, title, description);

        ctx.output('targetBranchName', targetBranchName);
        ctx.output('pullRequestUrl', pullRequestUrl);
        ctx.output('pullRequestId', pullRequestId);
      },
    });
  };