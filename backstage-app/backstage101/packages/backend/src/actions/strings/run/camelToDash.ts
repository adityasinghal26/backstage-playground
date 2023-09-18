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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';

export const modifyStringCamelToDash = () => {
    return createTemplateAction<{ 
      stringToModify: string;
    }>({
        id: 'strings:camel:dash',
        schema: {
          input: {
            required: ['stringToModify'],
            type: 'object',
            properties: {
              stringToModify: {
                type: 'string',
                title: 'String to modify',
                description: 'String to modify from camel format to dashed',
              }
            },
          },
          output: {
            type: 'object',
            properties: {
              updatedString: {
                type: 'string',
                title: 'Updated string',
              }
            },
          },
        },
  
      async handler(ctx) {

        const { input } = ctx;
        const { stringToModify } = input;

        ctx.logger.info('String to modify ' + `${stringToModify}`);

        const camelToDashCase = str => str.replace(/([A-Z])/g, val => `-${val.toLowerCase()}`);
        ctx.logger.info('Updated string ' + `${camelToDashCase}`);
        ctx.output('updatedString', camelToDashCase);
      },
    });
  };