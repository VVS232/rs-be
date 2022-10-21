import {
    S3Client,
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from 'node:stream';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import schema from './schema';
import { validate } from 'jsonschema';

const csv = require('csv-parser');

export const importFileParser = async (event: S3Event) => {
    const sqsClient = new SQSClient({ region: 'eu-west-1' });
    const s3client = new S3Client({ region: 'eu-west-1' });
    for (const record of event.Records) {
        const stream: Readable = (
            await s3client.send(
                new GetObjectCommand({
                    Bucket: 'rs-imported',
                    Key: record.s3.object.key
                })
            )
        ).Body;

        function parse() {
            const requests = [];

            return new Promise<void>((res) => {
                stream
                    .pipe(
                        csv({
                            mapHeaders: ({ header, index }) =>
                                index === 0 ? 'title' : header,
                            mapValues: ({ header, value }) => {
                                if (header === 'price' || header === 'count') {
                                    return +value;
                                }
                                return value.trim();
                            }
                        })
                    )
                    .on('data', (data) => {
                        const validationResult = validate(data, schema);
                        console.log('validation result', validationResult);
                        if (validationResult.errors.length === 0) {
                            console.log('sending to the queue', data);

                            requests.push(
                                sqsClient.send(
                                    new SendMessageCommand({
                                        QueueUrl: process.env.SQL_URL,
                                        MessageBody: JSON.stringify(data)
                                    })
                                )
                            );
                        }
                    })
                    .on('end', async () => {
                        console.log('parsing ended');
                        await s3client.send(
                            new CopyObjectCommand({
                                Bucket: 'rs-imported',
                                CopySource: `rs-imported/${record.s3.object.key}`,
                                Key: record.s3.object.key.replace(
                                    'uploaded',
                                    'parsed'
                                )
                            })
                        );
                        console.log(`file ${record.s3.object.key} copied`);

                        await s3client.send(
                            new DeleteObjectCommand({
                                Bucket: 'rs-imported',
                                Key: record.s3.object.key
                            })
                        );
                        console.log(`file ${record.s3.object.key} deleted`);
                        await Promise.all(requests);
                        res();
                    });
            });
        }
        await parse();
        return {
            statusCode: 200
        };
    }
};
