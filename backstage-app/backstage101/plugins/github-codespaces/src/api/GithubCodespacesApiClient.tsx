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

import { GithubCodespacesApi } from './GithubCodespacesApi';
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import { ConfigApi, OAuthApi } from "@backstage/core-plugin-api";
import { readGithubIntegrationConfigs } from "@backstage/integration";
// import { UsePaginationProps } from '@material-ui/lab';

/**
 * A client for fetching information for Github Codespaces implementing githubCodespacesApiRef
 * 
 * @public
 */
export class GithubCodespacesApiClient implements GithubCodespacesApi {

    private readonly configApi: ConfigApi; 
    private readonly githubAuthApi: OAuthApi;

    constructor(options: { configApi: ConfigApi, githubAuthApi: OAuthApi}) {
        this.configApi = options.configApi;
        this.githubAuthApi = options.githubAuthApi;
    }

    private async getOctokit(hostname: string = 'github.com'): Promise<Octokit> {
        // const { token } = await this.scmAuthApi.getCredentials({
        //   url: `https://${hostname}/`,
        //   additionalScope: {
        //     customScopes: {
        //       github: ['repo'],
        //     },
        //   },
        // });
        const auth = this.githubAuthApi;
        const configs = readGithubIntegrationConfigs(
          this.configApi.getOptionalConfigArray('integrations.github') ?? [],
        );
        const githubIntegrationConfig = configs.find(v => v.host === hostname);
        const baseUrl = githubIntegrationConfig?.apiBaseUrl;

        const token = await auth.getAccessToken(['repo','codespaces'])
        return new Octokit({ auth: token, baseUrl });
      }

    async listCodespacesForUser(): Promise<
        RestEndpointMethodTypes['codespaces']['listForAuthenticatedUser']['response']['data']
    > {
               
        const octokit = await this.getOctokit('github.com')
        const response = await octokit.rest.codespaces.listForAuthenticatedUser()

        return response.data
    };

};