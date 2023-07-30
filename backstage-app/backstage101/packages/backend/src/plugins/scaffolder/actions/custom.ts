import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import * as _backstage_plugin_scaffolder_node from '@backstage/plugin-scaffolder-node';
import * as _backstage_types from '@backstage/types';
// import { createWriteStream } from 'node:fs';
// import { pipeline } from 'node:stream';
// import { promisify } from 'node:util'

// const streamPipeline = promisify(pipeline);

const createBinaryToFileAction = () => {
    return createTemplateAction<{ contents: string; filename: string }>({
        id: 'binary:file:create',
        schema: {
          input: {
            required: ['contents', 'filename'],
            type: 'object',
            properties: {
              contents: {
                type: 'object',
                title: 'Contents',
                description: 'The contents of the file',
              },
              filename: {
                type: 'string',
                title: 'Filename',
                description: 'The filename of the file that will be created',
              },
            },
          },
        },
  
      async handler(ctx) {
        const text = ctx.input.contents;
        console.log(text);
        try {
            const data = JSON.parse(text); // Try to parse the response as JSON
            // The response was a JSON object
            // Do your JSON handling here
            console.log(data);
          } catch(error) {
            throw new Error("Did not receive JSON, instead received: ")
            // console.error(error);
            // The response wasn't a JSON object
            // Do your text handling here
          }
        // const wstream = createWriteStream(`/tmp/${ctx.input.filename}`);
        // wstream.write(`${ctx.input.contents}`);
        // wstream.end();
      },
    });
  };

export { createBinaryToFileAction };
