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
import * as azdev from 'azure-devops-node-api';
import * as azgit from 'azure-devops-node-api/GitApi';
import { removeHttpsFromUrl } from './helpers';

export const getGitRepoDetailsAction = () => {
    return createTemplateAction<{ 
      gitRepoUrl: string;
      authToken: string; 
    }>({
        id: 'git:details:get',
        schema: {
          input: {
            required: ['gitRepoUrl','authToken'],
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
            },
          },
          output: {
            type: 'object',
            properties: {
              repositoryId: {
                type: 'string',
                title: 'Repository ID',
              },
              repositoryName: {
                type: 'string',
                title: 'Repository Name',
              },
              orgName: {
                type: 'string',
                title: 'Name of the Organization',
              },
              projectName: {
                type: 'string',
                title: 'Name of the Project (if any)',
              }
            },
          },
        },
  
      async handler(ctx) {
        const { input } = ctx;
        const { gitRepoUrl, authToken } = input;

        const gitRepoWithoutHttps = await removeHttpsFromUrl(gitRepoUrl);
        let gitRepoId: string = '';
        let gitRepoName: string = '';
        let gitOrgName: string = '';
        let gitProjectName: string = '';

        const isAzure = gitRepoUrl.toLowerCase().includes('azure');

        try {

          if(isAzure){
            const [domain, orgName, projectName, git_ref, repoName] = gitRepoWithoutHttps.split('/');
  
            const orgUrl = `https://${domain}/${orgName}`;
            const token = authToken;
            
            ctx.logger.info('Organisation URL: '+ `${orgUrl}`);  
            
            const authHandler = azdev.getPersonalAccessTokenHandler(token); 
            const connection = new azdev.WebApi(orgUrl, authHandler);    
            const gitClient: azgit.IGitApi = await connection.getGitApi();
  
            const gitRepo = gitClient.getRepository(repoName, projectName);
            gitRepoId = (await gitRepo).id!;
            gitRepoName = repoName;
            gitOrgName = orgName;
            gitProjectName = projectName;
          }   
        } catch(err){
          ctx.logger.error(err);
        }

        ctx.logger.info('Organization : ' + `${gitOrgName}`);
        ctx.logger.info('Project Name : ' + `${gitProjectName}`);
        ctx.logger.info('Repository Name : ' + `${gitRepoName}`);
        ctx.logger.info('Repository ID : ' + `${gitRepoId}`);

        ctx.output('repositoryId', gitRepoId);
        ctx.output('repositoryName',gitRepoName);
        ctx.output('orgName', gitOrgName);
        ctx.output('projectName', gitProjectName);
      },
    });
  };