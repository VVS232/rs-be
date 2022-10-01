import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ddbDocClient } from 'src/db/dynamo-doc-client';

export const getProductList: APIGatewayProxyHandler = async () => {
    console.log('List function was called');

    const items = (
        await ddbDocClient.send(
            new ScanCommand({
                TableName: process.env.PRODUCTS_TABLE_NAME
            })
        )
    ).Items as {
        id: string;
        title: string;
        description: string;
        price: number;
    }[];
    const stock = (
        await ddbDocClient.send(
            new ScanCommand({
                TableName: process.env.STOCK_TABLE_NAME
            })
        )
    ).Items as {
        product_id: string;
        count: number;
    }[];
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify(
            items.map((i) => ({
                ...i,
                count: stock.find((s) => i.id === s.product_id)?.count || 0
            }))
        )
    };
};
