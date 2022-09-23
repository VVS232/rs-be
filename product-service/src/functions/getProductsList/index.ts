import { handlerPath } from '@libs/handler-resolver';
import { AWS } from '@serverless/typescript';

const productListFunctionConfig: AWS['functions'][number] = {
    handler: `${handlerPath(__dirname)}/handler.getProductList`,
    events: [
        {
            http: {
                method: 'GET',
                cors: true,
                path: 'products'
            }
        }
    ]
};
export default productListFunctionConfig;
