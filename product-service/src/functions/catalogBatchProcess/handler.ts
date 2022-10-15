import { SQSEvent } from 'aws-lambda';
import { validate } from 'jsonschema';
import schema from './schema';
import { v4 as uuidv4 } from 'uuid';
import { ddbDocClient } from 'src/db/dynamo-doc-client';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export const catalogBatchProcess = async (event: SQSEvent) => {
    console.log('event', event);
    console.log('records', event.Records);

    for (const record of event.Records) {
        console.log('prcessing items', record);

        const jsonProd = JSON.parse(record.body);
        const validationResult = validate(jsonProd, schema);
        if (validationResult.errors.length === 0) {
            const newProdId = uuidv4();

            const productSent = await ddbDocClient.send(
                new PutCommand({
                    TableName: process.env.PRODUCTS_TABLE_NAME,
                    Item: {
                        id: newProdId,
                        title: jsonProd.title,
                        description: jsonProd.description,
                        price: jsonProd.price
                    }
                })
            );
            const stock = await ddbDocClient.send(
                new PutCommand({
                    TableName: process.env.STOCK_TABLE_NAME,
                    Item: { product_id: newProdId, count: jsonProd.count }
                })
            );
            const snsClient = new SNSClient({ region: 'eu-west-1' });
            await snsClient.send(
                new PublishCommand({
                    Subject: 'Product added',
                    Message: `Products ${event.Records} has been added`,
                    TopicArn: process.env.TOPIC_ARN
                })
            );
        }
    }
};
