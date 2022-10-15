// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const importFileParserFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.importFileParser`,
    events: [
        {
            s3: {
                bucket: 'rs-imported',
                event: 's3:ObjectCreated:*',
                rules: [{ prefix: 'uploaded' }],
                existing: true
            }
        }
    ]
};
export default importFileParserFunctionConfig;
