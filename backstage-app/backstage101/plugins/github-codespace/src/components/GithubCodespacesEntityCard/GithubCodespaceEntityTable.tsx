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

import { ResponseErrorPanel, Table, TableColumn } from "@backstage/core-components";
import { RestEndpointMethodTypes } from "@octokit/rest";
import React from "react";
import { Box } from "@material-ui/core";
import { Codespace } from "../../api";
import { booleanIndicator } from "../utils";

const columns: TableColumn[] = [
    {
        title: 'Name',
        field: 'display_name',
        width: 'auto',
    },
    {
        title: 'Branch',
        field: 'branch',
        width: 'auto',
        render: (row: Partial<Codespace>) => row.git_status?.ref,
    },
    {
        title: 'Uncommitted',
        field: 'uncommitted',
        width: 'auto',
        render: (row: Partial<Codespace>) => booleanIndicator({
            status: row.git_status?.has_uncommitted_changes,
        }),
    }
];

type GithubCodespaceEntityTableProps = {
    count?: number;
    list?: RestEndpointMethodTypes['codespaces']['listInRepositoryForAuthenticatedUser']['response']['data']['codespaces'];
    loading: boolean;
    error?: Error;
}

export const GithubCodespaceEntityTable = ({ count, list, loading, error}: GithubCodespaceEntityTableProps) => {
    if (error) {
        return (
            <div>
                <ResponseErrorPanel error={error}/>
            </div>
        );
    }

    return (
        <Table
            isLoading={loading}
            columns={columns}
            options={{
                search: false,
                paging: true,
                pageSize: 3,
                pageSizeOptions: [3, 5, 8],
                showTitle: true,
                showEmptyDataSourceMessage: !loading,
            }}
            title={
                <Box display="flex" alignItems="center" fontSize={24}>
                    {/* <GitHubIcon/> */}
                    {/* <Box mr={1} /> */}
                    Codespace Details - Count ({count})
                </Box>
            }
            data={list ?? []}
        />
    );
};