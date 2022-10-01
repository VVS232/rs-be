import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const productByIdFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.getProductById`,
    events: [
        {
            http: {
                method: 'GET',
                cors: true,
                path: 'products/{productId}'
            }
        }
    ]
};
export default productByIdFunctionConfig;
