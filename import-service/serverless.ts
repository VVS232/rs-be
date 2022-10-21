import type { AWS } from '@serverless/typescript';

import importProductFile from '@functions/import-product-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    useDotenv: true,
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        // apiGateway: {
        //   minimumCompressionSize: 1024,
        //   shouldStartNameWithService: true,
        // },
        environment: {
            SQL_URL: '${env:SQS_URL}'
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: ['sqs:*'],
                Resource: [
                    'arn:aws:sqs:eu-west-1:826106127846:rs-new-products-queue'
                ]
            }
        ]
    },
    resources: {
        Resources: {
            SQSQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'rs-new-products-queue'
                }
            },
            Unauthorized: {
                Type: 'AWS::ApiGateway::GatewayResponse',
                Properties: {
                    ResponseParameters: {
                        'gatewayresponse.header.Access-Control-Allow-Origin':
                            "'*'",
                        'gatewayresponse.header.Access-Control-Allow-Headers':
                            "'*'"
                    },
                    ResponseType: 'DEFAULT_4XX',
                    RestApiId: { Ref: 'ApiGatewayRestApi' }
                }
            }
        }
    },
    // import the function via paths
    functions: { importProductFile, importFileParser },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10
        }
    }
};

module.exports = serverlessConfiguration;
