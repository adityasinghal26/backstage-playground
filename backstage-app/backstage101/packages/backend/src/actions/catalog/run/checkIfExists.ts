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
import { CatalogApi } from '@backstage/catalog-client';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { parseEntityRef, stringifyEntityRef } from '@backstage/catalog-model';

export const checkEntityIfExistsAction = (options: {
  catalogClient: CatalogApi,
}) => {
    
    const { catalogClient } = options;

    return createTemplateAction<{ 
      entityRef: string;
      defaultKind: string;
      defaultNamespace: string;
    }>({
        id: 'catalog:entity:exists',
        schema: {
          input: {
            required: [],
            type: 'object',
            properties: {
              entityRef: {
                type: 'string',
                title: 'Entity reference',
                description: 'Entity reference of the entity to get',
              },
              defaultKind: {
                type: 'string',
                title: 'The Default Kind',
              },
              defaultNamespace: {
                type: 'string',
                title: 'The Default Namespace',
              },
            },
          },
          output: {
            type: 'object',
            properties: {
              entityExists: {
                type: 'boolean',
                title: 'Whether the given entity reference exists or not',
              }
            },
          },
        },
  
      async handler(ctx) {

        const { input } = ctx;
        const { entityRef, defaultKind, defaultNamespace } = input;
        let exists: boolean = false;

        if (entityRef) {
          const entity = await catalogClient.getEntityByRef(
            stringifyEntityRef(
              parseEntityRef(entityRef, { defaultKind, defaultNamespace }),
            ),
            {
              token: ctx.secrets?.backstageToken,
            },
          );
  
          if (entity) {
            exists = true;
            throw new Error(`Entity ${entityRef} already exists. Duplicate not allowed. Please give another application name.`);
          }
        }
        ctx.logger.info('Application does not exist. Proceeding with further steps .');
        ctx.output('entityExists', exists);
      },
    });
  };