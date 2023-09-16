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
import * as azdev from 'azure-devops-node-api';
import * as azgit from 'azure-devops-node-api/GitApi';
import { GitPullRequest } from 'azure-devops-node-api/interfaces/GitInterfaces';

export const removeHttpsFromUrl = async(
  repoUrl: string,
): Promise<string> => {
  return repoUrl.replace(/^https?:\/\//, '');
}

export const cloneGitRepo = async (
  git: any,
  remoteUrl: string,
): Promise<any> => {
  git.init();
  git.clone(remoteUrl)
      .then(() => console.log('Git clone finished.'))
      .catch((err: any) => console.log('Git clone failed: ', err));
}

export const copyGitChanges = async (
  fs: any,
  sourcePath: string,
  targetPath: string,
): Promise<any> => {
  fs.cp(sourcePath, targetPath, { recursive: true },
    (err: any) => console.error(err));
}

export const createAndCheckoutBranch = async(
  git: any,
  branch: string,
): Promise<any> => {
  git.checkoutLocalBranch(branch)
  .catch((err: any) => console.error(err));
}

export const commitAndPushGitChanges = async (
  git: any,
  addPath: string,
  commitMessage: string,
  branchName: string,
): Promise<any> => {
  git.add(addPath)
        .commit(commitMessage)
        .push(['-u', 'origin', branchName], () => console.log('done'))
        .catch((err: any) => console.log('Git changes failed:', err));
}

export const createPullRequest = async(
  gitRepoUrl: string,
  personalAccessToken: string,
  sourceBranch: string,
  targetBranch: string,
  title: string,
  description: string,
): Promise<{ targetBranchName: string; pullRequestUrl: string; pullRequestId: number}> => {

    let targetBranchName: string = '';
    let pullRequestUrl: string = '';
    let pullRequestId: number = -1;

    const isAzure = gitRepoUrl.toLowerCase().includes('azure');

    try {

      if(isAzure){
        const [domain, orgName, projectName, rest, repoName] = gitRepoUrl.split('/');
  
        const orgUrl = `'https://${domain}/${orgName}'`;
        const token = personalAccessToken;
  
        console.log('Organisation URL: ', orgUrl);
        
        const authHandler = azdev.getPersonalAccessTokenHandler(token); 
        const connection = new azdev.WebApi(orgUrl, authHandler);    
        const git: azgit.IGitApi = await connection.getGitApi();
        const gitPullRequest: GitPullRequest = <GitPullRequest>{
          repository: repoName,
          sourceRefName: sourceBranch,
          targetRefName: targetBranch,
          title: title,
          description: description
        }; 
  
        const gitRepo = git.getRepository(repoName, projectName);
        const gitRepoId = (await gitRepo).id!;
        const gitPullRequestCreated = git.createPullRequest(gitPullRequest, gitRepoId, projectName, true);
    
        targetBranchName = (await gitPullRequestCreated).targetRefName!;
        pullRequestUrl = (await gitPullRequestCreated).url!;
        pullRequestId = (await gitPullRequestCreated).pullRequestId!;
      }   
  
    } catch(err){
      console.log('Pull Request creation failed: ', err)
    }

    return { targetBranchName, pullRequestUrl, pullRequestId };
    
};