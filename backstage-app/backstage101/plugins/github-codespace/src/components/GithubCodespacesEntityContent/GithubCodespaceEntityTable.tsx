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

import { GitHubIcon, ResponseErrorPanel, Table, TableColumn } from "@backstage/core-components";
import { RestEndpointMethodTypes } from "@octokit/rest";
import React from "react";
import { Box } from "@material-ui/core";
import { Codespace } from "../../api";
import { booleanIndicator, codespaceState, getGitStatusView } from "../utils";
import { DateTime } from "luxon";

const columns: TableColumn[] = [
    {
        title: 'Codespace',
        field: 'name',
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
    },
    {
        title: 'Ahead/Behind',
        field: 'git_status',
        width: 'auto',
        render: (row: Partial<Codespace>) => getGitStatusView({
            ahead: row.git_status?.ahead,
            behind: row.git_status?.behind,
        })
    },
    {
        title: 'State',
        field: 'state',
        width: 'auto',
        render: (row: Partial<Codespace>) => codespaceState({
            status: row.state,
        }),
    },
    {
        title: 'Age',
        field: 'age',
        width: 'auto',
        render: (row: Partial<Codespace>) =>
      (row.created_at
        ? DateTime.fromISO(row.created_at)
        : DateTime.now()
      ).toRelative(),
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
                search: true,
                paging: true,
                pageSize: 5,
                showEmptyDataSourceMessage: !loading,
            }}
            title={
                <Box display="flex" alignItems="center">
                    <GitHubIcon/>
                    <Box mr={1} />
                    Github Codespaces (In Repo) - List ({count})
                </Box>
            }
            data={list ?? []}
        />
    );
};