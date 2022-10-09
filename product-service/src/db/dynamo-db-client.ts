import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export const REGION = 'eu-west-1'; // For example, "us-east-1".
// Create an Amazon DynamoDB service client object.
export const ddbClient = new DynamoDBClient({
    region: REGION
});
