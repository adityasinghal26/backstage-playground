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
import { getProjectNameFromEntity } from "../components/utils";
import { useCallback } from "react";
// import useAsyncFn from "react-use/lib/useAsyncFn";

export function useOpenCodespaceInEntityForUser(
    entity: Entity,
) {
    const api = useApi(githubCodespacesApiRef);

    const verifyCodespaceNameWithEntity = (entityName: string, codespaceName: any) => {
        return (codespaceName.toLowerCase().indexOf(entityName.toLowerCase()) >= 0);
    }

    const startCodespace = useCallback(async() => {
        const entityName = entity.metadata.name;
        const projectName = getProjectNameFromEntity(entity);
        const [owner, repositoryName] = (projectName ?? '/').split('/');
        const codespacesListInRepo = await api.listCodespacesInRepoForUser(owner, repositoryName); 

        const { codespaces } =  codespacesListInRepo;

        const verifiedCodespaces = codespaces.filter((codespace) =>
            verifyCodespaceNameWithEntity(entityName, codespace.display_name)
        )

        const count = verifiedCodespaces.length;

        return (
            (count === 0) ?
            ((await api.createCodespaceInEntityForUser(entityName,owner,repositoryName))) :
            api.startCodespaceForUser(verifiedCodespaces[0].name)
        );
    },[api, entity])

    // const { value, loading, error } = useAsync(() => startCodespace(), [api, entity]);

    // const [state, startCodespaces] = useAsyncFn(
    //     () => startCodespace(),
    //   );
    

    // const { value, loading, error } = useAsync(() => {
    //     const entityName = entity.metadata.name;
    //     const projectName = getProjectNameFromEntity(entity);
    //     const [owner, repositoryName] = (projectName ?? '/').split('/');
    //     const codespacesListInRepo = await api.listCodespacesInRepoForUser(owner, repositoryName);
    //     let total_count: any;
    //     let codespaceName: any;

    //     total_count = codespacesListInRepo.then((result) => {
    //         return result.total_count;
    //     }).catch(() => {
    //         return -1;
    //     })

    //     if ( total_count === 0 ) {
    //         const codespace = api.createCodespaceInEntityForUser(entityName, owner, repositoryName);
    //         codespaceName = codespace.then((result) => {
    //             return result.name;
    //         }).catch(() => {
    //             return '';
    //         })
    //     }

    //     return api.startCodespaceForUser(codespaceName);
    // }, [api]);

    // return {
    //     data: value,
    //     loading,
    //     error,
    // };

    return { startCodespace };
}
