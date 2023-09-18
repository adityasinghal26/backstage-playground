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
// import path from 'path';
// import { pipeline } from 'node:stream';
import uuid from 'uuid';
import * as azdev from 'azure-devops-node-api';
import * as azgit from 'azure-devops-node-api/GitApi';
import { GitCommitRef, GitPullRequest, GitPullRequestCompletionOptions, PullRequestStatus } from 'azure-devops-node-api/interfaces/GitInterfaces';
import fs from 'node:fs';
import { removeHttpsFromUrl } from './helpers';

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
              repositoryId: {
                type: 'string',
                title: 'Repository ID',
              },
              sourceBranchName: {
                type: 'string',
                title: 'Source branch name of the merge request',
              },
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
        const [domain, orgName, projectName, git_ref, repoName] = gitRepoWithoutHttps.split('/');

        const git = simpleGit();
        const user = `${orgName}`;

        const fullSourcePath = `${ctx.workspacePath}/${sourcePath}`;
        const gitPath = `${ctx.workspacePath}/git`;
        const fullTargetPath = `${ctx.workspacePath}/git/${targetPath}`;
        const sourceBranch = `backstage-${uuid.v4()}`;
        const finalCommitMessage = commitMessage.length !== 0  ? commitMessage : 'first commit!';

        console.log('Git URL without HTTPS: ', gitRepoWithoutHttps);

        const remoteUrl = `https://${user}:${authToken}@${gitRepoWithoutHttps}`;

        // cloneGitRepo with authenticated repository URL
        await git.init();
        await git.clone(remoteUrl, gitPath)
           .then(() => console.log('Git clone finished.'))
          .catch((err: any) => console.log('Git clone failed: ', err));

        // update current working directory for Git to add/commit/push changes
        // resolved remote 'origin' not found ERROR
        await git.cwd(gitPath);
        const remotes: RemoteWithoutRefs[] = await git.getRemotes(false);
        console.log('Length of remote repos in working directory: ', remotes.length);

        // checkout a temporary branch to push the latest changes
        await git.checkoutLocalBranch(sourceBranch)
          .catch((err: any) => console.error(err));

        // copy the fresh generated application to Git path, for monorepo structure
        fs.cpSync(fullSourcePath, fullTargetPath, { recursive: true });

        // Commit and push the latest changes to remote repository with a sample user
        await git.add(`${gitPath}/*`)
        .addConfig('user.name','Scaffolder',true,"global")
        .addConfig('user.email','scaffolder@backstage.com',true,"global")
        .commit(finalCommitMessage)
        .push(['origin', sourceBranch], () => console.log('push done'))
        .catch((err: any) => console.log('Git changes failed:', err));

        let gitRepoId: string = '';
        let targetBranchName: string = '';
        let pullRequestUrl: string = '';
        let pullRequestId: number = -1;

        const isAzure = gitRepoUrl.toLowerCase().includes('azure');

        try {

          if(isAzure){
            // const [dom, org, projectName, restold, repoName] = gitRepoWithoutHttps.split('/');
  
            const orgUrl = `https://${domain}/${orgName}`;
            const token = authToken;
            
            console.log('Organisation URL: ', orgUrl);  
            
            const authHandler = azdev.getPersonalAccessTokenHandler(token); 
            const connection = new azdev.WebApi(orgUrl, authHandler);    
            const gitClient: azgit.IGitApi = await connection.getGitApi();
            const gitPullRequest: GitPullRequest = <GitPullRequest>{
              repository: repoName,
              sourceRefName: `refs/heads/${sourceBranch}`,
              targetRefName: `refs/heads/${targetBranch}`,
              title: title,
              description: description
            }; 
  
            const gitRepo = gitClient.getRepository(repoName, projectName);
            gitRepoId = (await gitRepo).id!;
            let gitPullRequestCreated = await gitClient.createPullRequest(gitPullRequest, gitRepoId, projectName, true);
            
            targetBranchName = (await gitPullRequestCreated).targetRefName!;
            pullRequestUrl = (await gitPullRequestCreated).url!;
            pullRequestId = (await gitPullRequestCreated).pullRequestId!;

            let pullRequestCompletionOptions: GitPullRequestCompletionOptions = <GitPullRequestCompletionOptions>{
              bypassPolicy: true,
              bypassReason: 'Initial commit',
              deleteSourceBranch: false,
            }

            const pullRequestStatus: PullRequestStatus = PullRequestStatus.Completed;

            let gitPullRequestToUpdate: GitPullRequest = <GitPullRequest>{
              lastMergeSourceCommit: gitPullRequestCreated.lastMergeSourceCommit,
              completionOptions: pullRequestCompletionOptions,
              status: pullRequestStatus,
            }; 
            
            const updatedGitPullRequest: GitPullRequest = await gitClient.updatePullRequest(gitPullRequestToUpdate,gitRepoId,pullRequestId,projectName)
            const updatedPrStatus = updatedGitPullRequest.status!;
            const updatedPrClosedDate = updatedGitPullRequest.closedDate!;

            console.log('Pull request success: ');
            console.log('sourceBranchName: ', sourceBranch);
            console.log('targetBranchName: ', targetBranchName);
            console.log('pullRequestUrl: ', pullRequestUrl);
            console.log('pullRequestId: ', pullRequestId);
            console.log('updatedPrStatus: ', updatedPrStatus);
            console.log('updatedPrClosedDate: ', updatedPrClosedDate);
          }   
        } catch(err){
          console.log('Pull Request creation failed: ', err)
        }

        ctx.output('repositoryId', gitRepoId);
        ctx.output('sourceBranchName',sourceBranch);
        ctx.output('targetBranchName', targetBranchName);
        ctx.output('pullRequestUrl', pullRequestUrl);
        ctx.output('pullRequestId', pullRequestId);
      },
    });
  };