// Create the DynamoDB service client module using ES6 syntax.
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from 'src/db/dynamo-doc-client';

export const params = {
    TableName: 'rs-product'
};

export const scanTable = async () => {
    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        console.log('success', data.Items);
    } catch (err) {
        console.log('Error', err);
    }
};
scanTable();
