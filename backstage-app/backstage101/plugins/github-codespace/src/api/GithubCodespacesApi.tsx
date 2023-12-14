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

import { RestEndpointMethodTypes } from '@octokit/rest';
import { createApiRef } from '@backstage/core-plugin-api';

/** @public */
export const githubCodespacesApiRef = createApiRef<GithubCodespacesApi>({
    id: 'plugin.github-codespaces.service',
});

/** 
 * A client object for fetching information about Github Codespaces
 * 
 * @public */
export type GithubCodespacesApi = {

    getRepositoryDetails: (owner: string, repository_name: string) =>
        Promise<
            RestEndpointMethodTypes['repos']['get']['response']['data']
        >

    listCodespacesForUser: () => 
        Promise<
            RestEndpointMethodTypes['codespaces']['listForAuthenticatedUser']['response']['data']
        >

    listCodespacesInRepoForUser: (owner: string, repository_name: string) =>
        Promise<
            RestEndpointMethodTypes['codespaces']['listInRepositoryForAuthenticatedUser']['response']['data']
        >

    startCodespaceForUser: (codespaceName: string) => Promise<
        RestEndpointMethodTypes['codespaces']['startForAuthenticatedUser']['response']['data']
    >

    createCodespaceInEntityForUser: (displayName: string, owner: string, repositoryName: string) =>
        Promise<
            RestEndpointMethodTypes['codespaces']['createWithRepoForAuthenticatedUser']['response']['data']
        > 

};