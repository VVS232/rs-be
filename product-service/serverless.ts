import type { AWS } from '@serverless/typescript';

import getProductById from '@functions/getProductsById';
import getProductList from '@functions/getProductsList';
import createProduct from '@functions/createProduct';
import catalogBatch from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
    service: 'product-service',
    useDotenv: true,
    frameworkVersion: '3',
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
            PRODUCTS_TABLE_NAME: '${env:PRODUCTS_TABLE_NAME}',
            STOCK_TABLE_NAME: '${env:STOCK_TABLE_NAME}',
            SQS_ARN: '${env:SQS_ARN}',
            TOPIC_ARN: {
                Ref: 'SNSTopic'
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:Query',
                    'dynamodb:Scan',
                    'dynamodb:GetItem',
                    'dynamodb:PutItem'
                ],
                Resource: '*'
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: 'SNSTopic'
                }
            }
        ]
    },
    // import the function via paths
    functions: { getProductList, getProductById, createProduct, catalogBatch },
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
    },
    resources: {
        Resources: {
            SNSTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'rs-product-topic'
                }
            },
            SNSSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'teenwolf23299@gmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'SNSTopic'
                    }
                }
            },
            products: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${env:PRODUCTS_TABLE_NAME}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            },
            stock: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${env:STOCK_TABLE_NAME}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'product_id',
                            AttributeType: 'S'
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'product_id',
                            KeyType: 'HASH'
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
