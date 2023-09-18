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
import { RemoteWithoutRefs, simpleGit } from 'simple-git';
import fs from 'node:fs';
import { removeHttpsFromUrl } from './helpers';

export const createGitCommitPushAction = () => {
    return createTemplateAction<{ 
      gitRepoUrl: string;
      authToken: string; 
      branch: string; 
      sourcePath: string;
      targetPath: string;
      commitMessage: string;
      ownerUser: string;
      ownerEmail: string;
    }>({
        id: 'git:commit:push',
        schema: {
          input: {
            required: ['gitRepoUrl','authToken', 'branch'],
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
              branch: {
                type: 'string',
                title: 'Commit Branch Name',
                description: 'The branch name of the git commit',
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
              },
              ownerUsername: {
                type: 'string',
                title: 'User Name',
                description: 'User Name for the user requesting application',
              },
              ownerEmail: {
                type: 'string',
                title: 'Email ID',
                description: 'Email ID for the user requesting application',
              },
            },
          },
          output: {
            type: 'object',
            properties: {
              repositoryUrl: {
                type: 'string',
                title: 'Repository URL for the Git repository',
              },
              branchName: {
                type: 'string',
                title: 'Branch to which commit is done',
              },
            },
          },
        },
  
      async handler(ctx) {
        const { input } = ctx;
        const { gitRepoUrl, authToken, branch, commitMessage } = input;
        const { sourcePath, targetPath, ownerUser, ownerEmail } = input;

        const gitRepoWithoutHttps = await removeHttpsFromUrl(gitRepoUrl);

        const git = simpleGit();
        const user = ownerUser.length !== 0 ? `${ownerUser}` : "Scaffolder";
        const email = ownerEmail.length !== 0 ? `${ownerEmail}` : "scaffolder@backstage.com";

        const gitPath = `${ctx.workspacePath}/git`;
        const sourceBranch = `${branch}`;
        const fullSourcePath = sourcePath.length !== 0 ? `${ctx.workspacePath}/${sourcePath}` : `${ctx.workspacePath}`;
        const fullTargetPath = targetPath.length !== 0 ? `${gitPath}/${targetPath}` : `${gitPath}`;
        const finalCommitMessage = commitMessage.length !== 0  ? commitMessage : 'first commit!';

        ctx.logger.info('Git URL without HTTPS: ' + `${gitRepoWithoutHttps}`);

        const remoteUrl = `https://${user}:${authToken}@${gitRepoWithoutHttps}`;

        // cloneGitRepo with authenticated repository URL
        await git.init();
        await git.clone(remoteUrl, gitPath)
           .then(() => ctx.logger.info('Git clone finished.'))
          .catch((err: any) => ctx.logger.error(err));

        // update current working directory for Git to add/commit/push changes
        // resolved remote 'origin' not found ERROR
        await git.cwd(gitPath);
        const remotes: RemoteWithoutRefs[] = await git.getRemotes(false);
        ctx.logger.info('Length of remote repos in working directory: ' + `${remotes.length}`);

        // checkout a temporary branch to push the latest changes
        await git.checkoutLocalBranch(sourceBranch)
          .catch((err: any) => ctx.logger.error(err));

        // copy the fresh generated application to Git path, for monorepo structure
        fs.cpSync(fullSourcePath, fullTargetPath, { recursive: true });

        // Commit and push the latest changes to remote repository with a sample user
        await git.add(`${gitPath}/*`)
        .addConfig('user.name',`${user}`,true,"global")
        .addConfig('user.email',`${email}`,true,"global")
        .pull('origin',sourceBranch)
        .commit(finalCommitMessage)
        .push(['origin', sourceBranch], () => ctx.logger.info('Git push done.'))
        .catch((err: any) => ctx.logger.error(err));

        fs.rmSync(`${gitPath}`,{recursive: true, force: true});

        ctx.output('repositoryUrl', gitRepoUrl);
        ctx.output('branchName',branch);
      },
    });
  };