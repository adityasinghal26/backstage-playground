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
import path from 'path';
// import zlib from 'zlib';
import unzipper from 'unzipper';
// import { pipeline } from 'node:stream';
// import JSZip from 'jszip';
import fs from 'node:fs';

export const createUnzipFileAction = () => {
    return createTemplateAction<{ 
      absoluteFilePath: string; 
      fileName: string; 
      extractPath: string; 
    }>({
        id: 'unzip:file:create',
        schema: {
          input: {
            required: ['absoluteFilePath', 'fileName', 'extractPath'],
            type: 'object',
            properties: {
                absoluteFilePath: {
                type: 'string',
                title: 'Absolute Zip file path',
                description: 'The absolute file path of the zip file',
              },
                fileName: {
                type: 'string',
                title: 'Zip filename',
                description: 'The filename of the zip file',
              },
                extractPath: {
                type: 'string',
                title: 'Extract Path',
                description: 'The filepath to extract the zip file that will be created',
              }
            },
          },
        },
  
      async handler(ctx) {

        const filenameWithoutExtension = path.parse(ctx.input.fileName).name;
        const fullInputPath = `${ctx.workspacePath}/${ctx.input.fileName}`;
        const fullExtractPath = `${ctx.workspacePath}/${filenameWithoutExtension}`;

        ctx.logger.info('Full input path ' + `${fullInputPath}`);

        fs.mkdir(fullExtractPath, (error) => {
            if (error) {
              ctx.logger.error(error);
            } else {
              ctx.logger.info("New Directory created successfully !!" + `${fullExtractPath}`);
            }
        })

        // const unzip = zlib.createUnzip();
        // const input = fs.createReadStream(fullInputPath);
        // const output = fs.createWriteStream(fullExtractPath);
        // pipeline(input, unzip, output, (error) => {
        //    if (error) console.log(error);
        // });
        // fs.createReadStream(fullInputPath)
        //  .pipe(unzipper.Extract({ path: fullExtractPath }))
        //  .on("close", () => {
        //   console.log("Files unzipped successfully");
        // });
      },
    });
  };