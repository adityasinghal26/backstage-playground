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

import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import {
  generateBackstageUrl,
  generateApiUrl,
  http,
  getObjFieldCaseInsensitively,
} from './helpers';
import { HttpOptions, Headers, Params, Methods, Body } from './types';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export function createCustomHttpBackstageAction(options: {
  discovery: DiscoveryApi;
}) {
  const { discovery } = options;
  return createTemplateAction<{
    name: string;
    useProxy: boolean;
    baseUrl: string;
    path: string;
    method: Methods;
    headers?: Headers;
    params?: Params;
    body?: any;
    logRequestPath?: boolean;
  }>({
    id: 'custom:http:request',
    description:
      'Sends a HTTP request to the Backstage API. It uses the token of the user who triggers the task to authenticate requests.',
    schema: {
      input: {
        type: 'object',
        required: ['path', 'method', 'useProxy'],
        properties: {
          name: {
            type: 'string',
            title: 'Application Name',
            description: 'The application name for the zip file',
          },
          method: {
            title: 'Method',
            type: 'string',
            description: 'The method type of the request',
            enum: [
              'GET',
              'HEAD',
              'OPTIONS',
              'POST',
              'UPDATE',
              'DELETE',
              'PUT',
              'PATCH',
            ],
          },
          useProxy: {
            type: 'boolean',
            title: 'Use Backstage Proxy',
            description: 'Whether to use Backstage Proxy or not',
          },
          baseUrl: {
            type: 'string',
            title: 'Base URL for API',
            description: 'Base URL for API in case proxy is not used',
          },
          path: {
            title: 'Request path',
            description: 'The url path you want to query',
            type: 'string',
          },
          headers: {
            title: 'Request headers',
            description: 'The headers you would like to pass to your request',
            type: 'object',
          },
          params: {
            title: 'Request query params',
            description:
              'The query parameters you would like to pass to your request',
            type: 'object',
          },
          body: {
            title: 'Request body',
            description: 'The body you would like to pass to your request',
            type: ['object', 'string'],
          },
          logRequestPath: {
            title: 'Request path logging',
            description:
              'Option to turn request path logging off. On by default',
            type: 'boolean',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          code: {
            title: 'Response Code',
            type: 'string',
          },
          headers: {
            title: 'Response Headers',
            type: 'object',
          },
          body: {
            title: 'Response Body',
            type: 'object',
          },
        },
      },
    },

    async handler(ctx) {
      const { input } = ctx;
      const token = ctx.secrets?.backstageToken;
      const { method, params } = input;
      const logRequestPath = input.logRequestPath ?? true;
      const url = (input.useProxy) ? await generateBackstageUrl(discovery, input.path) : await generateApiUrl(input.baseUrl, input.path);

      if (logRequestPath) {
        ctx.logger.info(
          `Creating ${method} request with ${this.id} scaffolder action against ${url}`,
        );
      } else {
        ctx.logger.info(
          `Creating ${method} request with ${this.id} scaffolder action`,
        );
      }

      const queryParams: string = params
        ? new URLSearchParams(params).toString()
        : '';

      let inputBody: Body = undefined;

      if (
        input.body &&
        typeof input.body !== 'string' &&
        input.headers &&
        input.headers['content-type'] &&
        input.headers['content-type'].includes('application/json')
      ) {
        inputBody = JSON.stringify(input.body);
      } else {
        inputBody = input.body;
      }

      const httpOptions: HttpOptions = {
        method: input.method,
        url: queryParams !== '' ? `${url}?${queryParams}` : url,
        headers: input.headers ? (input.headers as Headers) : {},
        body: inputBody,
      };

      const authToken = getObjFieldCaseInsensitively(
        input.headers,
        'authorization',
      );

      if (token && !authToken) {
        ctx.logger.info(`Token is defined. Setting authorization header.`);
        httpOptions.headers.authorization = `Bearer ${token}`;
      }

      const { code, headers, body } = await http(httpOptions, ctx, ctx.logger);

      ctx.output('code', code);
      ctx.output('headers', headers);
      ctx.output('body', body);
    },
  });
}