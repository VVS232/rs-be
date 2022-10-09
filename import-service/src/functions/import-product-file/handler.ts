import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const importProductFile: APIGatewayProxyHandler = async (event) => {
    console.log(event, event.queryStringParameters);
    const { name } = event.queryStringParameters;
    if (!name) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            statusCode: 400,
            body: 'name was not provided'
        };
    }
    const s3Client = new S3Client({ region: 'eu-west-1' });
    const command = new PutObjectCommand({
        Bucket: 'rs-imported',
        Key: `uploaded/${name}`,
        ContentType: 'text/csv'
    });
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        statusCode: 200,
        body: await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    };
};
