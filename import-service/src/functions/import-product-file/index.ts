// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const importProductFileFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.importProductFile`,
    events: [
        {
            http: {
                method: 'GET',
                cors: true,
                path: 'import',
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                }
            }
        }
    ]
};
export default importProductFileFunctionConfig;
