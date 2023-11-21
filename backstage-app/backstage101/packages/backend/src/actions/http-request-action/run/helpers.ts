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
import { DiscoveryApi } from '@backstage/core-plugin-api';
import fs from 'node:fs';
import { fetch } from 'cross-fetch';
import FileType from 'file-type';
import { Logger } from 'winston';
import { HttpOptions } from './types';

class HttpError extends Error {}
const DEFAULT_TIMEOUT = 60_000;

export const generateBackstageUrl = async (
  discovery: DiscoveryApi,
  path: string,
): Promise<string> => {
  const [pluginId, ...rest] = (
    path.startsWith('/') ? path.substring(1) : path
  ).split('/');
  return `${await discovery.getBaseUrl(pluginId)}/${rest.join('/')}`;
};

export const generateApiUrl = async (
  baseUrl: string,
  path: string,
): Promise<string> => {
  const [...rest] = (
    path.startsWith('/') ? path.substring(1) : path
  ).split('/');
  return `${baseUrl}/${rest.join('/')}`;
};

export const http = async (
  options: HttpOptions,
  ctx: any,
  logger: Logger,
): Promise<any> => {
  let res: any;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
  const { url, ...other } = options;
  const httpOptions = { ...other, signal: controller.signal };

  try {
    res = await fetch(url, httpOptions);
    if (!res) {
      throw new HttpError(
        `Request was aborted as it took longer than ${
          DEFAULT_TIMEOUT / 1000
        } seconds`,
      );
    }
  } catch (e) {
    throw new HttpError(`There was an issue with the request: ${e}`);
  }

  clearTimeout(timeoutId);

  const headers: any = {};
  for (const [name, value] of res.headers) {
    headers[name] = value;
  }

  const isJSON = () =>
    headers['content-type'] &&
    headers['content-type'].includes('application/json');

  const isArrayBuffer = () =>
    headers['content-type'] &&
    headers['content-type'].includes('application/octet-stream');

  const saveOctetStreamBuffer = async ( bodyBuffer : ArrayBuffer ) => {
    const buffer = Buffer.from(bodyBuffer);
    const fileType = await FileType.fromBuffer(buffer);
    const fileTypeExtension = fileType?.ext!;
    try {
        if (typeof fileTypeExtension === "string") {
            logger.info('Context workspace path is ' + `${ctx.workspacePath}` + ' and file name input is ' + `${ctx.input.name}`);
            const outputFileName = `${ctx.workspacePath}/${ctx.input.name}.${fileTypeExtension}`
            fs.createWriteStream(outputFileName).write(buffer);
            logger.info('Successfully saved zip file ' + `${outputFileName}`)
        } else {
            logger.warn('File type could not be reliably determined! The binary data may be malformed! No file saved!')
        }
    } catch(e) {
        throw new Error(`Could not save body: ${e}`);
    }

  } 

  let body;
  try {
    // body = isArrayBuffer() ? await res.arrayBuffer() : { message: console.log("Not octet-stream") };
    if ( isArrayBuffer() ) {
        body = await res.arrayBuffer();
        logger.info("Body is found as octet-stream");
        saveOctetStreamBuffer(body);
    } else {
        body = isJSON() ? await res.json() : { message: await res.text() };
        console.info("Body was either JSON or converted to string object")
    }
  } catch (e) {
    throw new HttpError(`Could not get response: ${e}`);
  }

  if (res.status >= 400) {
    logger.error(
      `There was an issue with your request. Status code: ${
        res.status
      } Response body: ${JSON.stringify(body)}`,
    );
    throw new HttpError('Unable to complete request');
  }
  return { code: res.status, headers, body };
};

export const getObjFieldCaseInsensitively = (obj = {}, fieldName: string) => {
  const [, value = ''] =
    Object.entries<string>(obj).find(
      ([key]) => key.toLowerCase() === fieldName.toLowerCase(),
    ) || [];

  return value;
};