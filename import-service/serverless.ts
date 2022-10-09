import type { AWS } from '@serverless/typescript';

import importProductFile from '@functions/import-product-file';
import importFileParser from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1'
        // apiGateway: {
        //   minimumCompressionSize: 1024,
        //   shouldStartNameWithService: true,
        // },
        // environment: {
        //   AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        //   NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        // },
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
