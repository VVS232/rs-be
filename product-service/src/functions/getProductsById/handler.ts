import { Product } from 'src/mocks';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ddbDocClient } from 'src/db/dynamo-doc-client';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const getProductById: APIGatewayProxyHandler = async (event) => {
    console.log('Get by Id function was called with ' + event);

    const product = await ddbDocClient.send(
        new GetCommand({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Key: { id: event.pathParameters.productId }
        })
    );
    const stock = await ddbDocClient.send(
        new GetCommand({
            TableName: process.env.STOCK_TABLE_NAME,
            Key: { product_id: event.pathParameters.productId }
        })
    );
    const data = { ...product.Item, count: stock.Item?.count || 0 };
    if (!data)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            statusCode: 404,
            body: JSON.stringify('Product is not found')
        };
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

export function getProduct(products: Product[], id: string): Product | null {
    return products.find((p) => p.id === id) || null;
}
