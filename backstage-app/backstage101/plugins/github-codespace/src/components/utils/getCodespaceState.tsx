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

import { StatusAborted, StatusError, StatusOK, StatusPending, StatusRunning, StatusWarning } from "@backstage/core-components";
import React from "react";
import { CodespaceState } from "../../api";

export const codespaceState = (props: {
  status?: CodespaceState;
}) => {
  return (
    <>
      <StateIcon {...props} />
      {getStateDescription(props)}
    </>
  );
};

export function StateIcon({
  status,
}: {
  status?: CodespaceState;
}) {
  if (status === undefined) return null;
  switch (status) {
    case CodespaceState.Unknown:
      return <StatusWarning />;

    case CodespaceState.Created:
      return <StatusOK />;

    case CodespaceState.Queued:
      return <StatusPending />;

    case CodespaceState.Provisioning:
      return <StatusWarning />;

    case CodespaceState.Available:
      return <StatusRunning />;

    case CodespaceState.Awaiting:
      return <StatusWarning />;

    case CodespaceState.Unavailable:
      return <StatusError />;

    case CodespaceState.Deleted:
      return <StatusAborted />;

    case CodespaceState.Moved:
      return <StatusPending />;

    case CodespaceState.Shutdown:
      return <StatusAborted />;

    case CodespaceState.Archived:
      return <StatusPending />;

    case CodespaceState.Starting:
      return <StatusPending />;

    case CodespaceState.ShuttingDown:
      return <StatusWarning />;

    case CodespaceState.Failed:
      return <StatusError />;

    case CodespaceState.Exporting:
      return <StatusPending />;

    case CodespaceState.Updating:
      return <StatusRunning />;

    case CodespaceState.Rebuilding:
      return <StatusPending />;

    default:
      return <StatusPending />;
  }
}

export function getStateDescription({
  status,
}: {
  status?: CodespaceState;
}) {
  if (status === undefined) return null;
  switch (status) {
    case CodespaceState.Unknown:
      return 'Unknown';

    case CodespaceState.Created:
      return 'Created';

    case CodespaceState.Queued:
      return 'Queued';

    case CodespaceState.Provisioning:
      return 'Provisioning';

    case CodespaceState.Available:
      return 'Available';

    case CodespaceState.Awaiting:
      return 'Awaiting';

    case CodespaceState.Unavailable:
      return 'Unavailable';

    case CodespaceState.Deleted:
      return 'Deleted';

    case CodespaceState.Moved:
      return 'Moved';

    case CodespaceState.Shutdown:
      return 'Shutdown';

    case CodespaceState.Archived:
      return 'Archived';

    case CodespaceState.Starting:
      return 'Starting';

    case CodespaceState.ShuttingDown:
      return 'Shutting Down';

    case CodespaceState.Failed:
      return 'Failed';

    case CodespaceState.Exporting:
      return 'Exporting';

    case CodespaceState.Updating:
      return 'Updating';

    case CodespaceState.Rebuilding:
      return 'Rebuilding';

    default:
      return 'Pending';
  }

}