import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';
import schema from './schema';

const createProductFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.createProduct`,
    events: [
        {
            http: {
                method: 'POST',
                cors: true,
                path: 'products',
                request: {
                    schemas: {
                        'application/json': schema
                    }
                }
            }
        }
    ]
};
export default createProductFunctionConfig;
