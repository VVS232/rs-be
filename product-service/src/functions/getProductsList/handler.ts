import { APIGatewayProxyHandler } from 'aws-lambda';
import { productList } from '../../mocks';

export const getProductList: APIGatewayProxyHandler = async () => {
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify(productList)
    };
};
