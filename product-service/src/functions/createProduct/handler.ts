import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from 'src/db/dynamo-doc-client';
import { v4 as uuidv4 } from 'uuid';

export const createProduct = async (event) => {
    const newProdId = uuidv4();
    const productToPut = JSON.parse(event.body);
    console.log('Create function was called with ' + event);

    const productSent = await ddbDocClient.send(
        new PutCommand({
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: {
                id: newProdId,
                title: productToPut.title,
                description: productToPut.description,
                price: productToPut.price
            }
        })
    );
    const stock = await ddbDocClient.send(
        new PutCommand({
            TableName: process.env.STOCK_TABLE_NAME,
            Item: { product_id: newProdId, count: productToPut.count }
        })
    );
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: JSON.stringify('')
    };
};
