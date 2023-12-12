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

import { GitHubIcon } from "@backstage/core-components";
import { useListCodespacesInRepoForUser, useStartCodespaceForUser } from "../../hooks";
import { useEntity } from "@backstage/plugin-catalog-react";
import React from "react";

/**
 * A Backstage Card to list the Codespaces for the Authenticated User
 * 
 * @public
 */ 
export const GithubCodespacesActionsCard = () => {
    const { entity } = useEntity();

    // const [owner, repo] = (
    //     entity?.metadata.annotations?.[GITHUB_CODESPACES_ANNOTATION] ?? '/'
    //     .split('/');
    // )
    const { count, data, loading, error } = useListCodespacesInRepoForUser(entity);
    const codespace_name = data[0].name;
    const { web_url, load, err } = useStartCodespaceForUser(codespace_name);

    return <GitHubIcon />;
}