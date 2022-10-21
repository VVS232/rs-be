import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const catalogBatchFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.catalogBatchProcess`,
    events: [
        {
            sqs: {
                batchSize: 5,
                arn: '${env:SQS_ARN}'
            }
        }
    ]
};
export default catalogBatchFunctionConfig;
