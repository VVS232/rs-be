// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const importProductFileFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.importProductFile`,
    events: [
        {
            http: {
                method: 'GET',
                cors: {
                    origin: '*',
                    headers: [
                        'Content-Type',
                        'X-Amz-Date',
                        'Authorization',
                        'X-Api-Key',
                        'X-Amz-Security-Token',
                        'X-Amz-User-Agent'
                    ],
                    allowCredentials: true
                },
                path: 'import',
                request: {
                    parameters: {
                        querystrings: {
                            name: true
                        }
                    }
                },
                authorizer: {
                    name: 'basicAuthorizer',
                    arn: 'arn:aws:lambda:eu-west-1:826106127846:function:rs-authorization-service-dev-authorizer',
                    resultTtlInSeconds: 0,
                    identitySource: 'method.request.header.Authorization',
                    type: 'token'
                }
            }
        }
    ]
};
export default importProductFileFunctionConfig;
