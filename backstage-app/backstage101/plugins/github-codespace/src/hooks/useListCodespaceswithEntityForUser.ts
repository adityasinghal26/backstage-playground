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

import { Entity } from "@backstage/catalog-model";
import { githubCodespacesApiRef } from "../api"; 
import { useApi } from "@backstage/core-plugin-api";
import { RestEndpointMethodTypes } from "@octokit/rest";
import useAsync from "react-use/lib/useAsync";
import { getProjectNameFromEntity } from "../components/utils";

export function useListCodespaceswithEntityForUser(
    entity: Entity,
): {
    count?: RestEndpointMethodTypes['codespaces']['listInRepositoryForAuthenticatedUser']['response']['data']['total_count'];
    data?: RestEndpointMethodTypes['codespaces']['listInRepositoryForAuthenticatedUser']['response']['data']['codespaces'];
    loading: boolean;
    error?: Error;
} {
    const api = useApi(githubCodespacesApiRef);
    const entity_name = entity.metadata.name;

    const { value, loading, error } = useAsync(() => {
        const projectName = getProjectNameFromEntity(entity);
        const [owner, repository_name] = (projectName ?? '/').split('/');
        return api.listCodespacesInRepoForUser(owner, repository_name);
    }, [api]);

    const verifyCodespaceNameWithEntity = (entityName: string, codespaceName: any) => {
        return (codespaceName.toLowerCase().indexOf(entityName.toLowerCase()) >= 0);
    }

    const verifiedCodespaces = value?.codespaces.filter((codespace) =>
        verifyCodespaceNameWithEntity(entity_name, codespace.display_name)
    )

    return {
        count: verifiedCodespaces?.length,
        data: verifiedCodespaces,
        loading,
        error,
    };
}