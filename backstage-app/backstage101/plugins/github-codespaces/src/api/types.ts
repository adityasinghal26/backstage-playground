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

import { ConfigApi, OAuthApi } from '@backstage/core-plugin-api';

export type Options = {
    githubAuthApi: OAuthApi;
    configApi: ConfigApi;
}

export type Repository = {
    id: string;
    name: string;
    full_name: string;
    html_url: string;
}

export type CodespaceProperties = {
    id: number;
    name: string;
    display_name: string;
    repository: Repository;
    state: string;
    url: string;
    start_url: string;
    stop_url: string;
}

export type Codespace = {
    title: string;
    description: string;
    properties: CodespaceProperties;
}

export type CodespacesList = {
    total_count: number;
    codespaces: Codespace[];
}

export enum CodespaceState {
    'Unknown',
    'Created',
    'Queued',
    'Provisioning',
    'Available',
    'Awaiting',
    'Unavailable',
    'Deleted',
    'Moved',
    'Shutdown',
    'Archived',
    'Starting',
    'ShuttingDown',
    'Failed',
    'Exporting',
    'Updating',
    'Rebuilding',
}