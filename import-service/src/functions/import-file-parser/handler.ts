import {
    S3Client,
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import { S3Event } from 'aws-lambda';
import { Readable } from 'node:stream';
const csv = require('csv-parser');

export const importFileParser = async (event: S3Event) => {
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
            return new Promise<void>((res) => {
                stream
                    .pipe(csv())
                    .on('data', (data) => {
                        console.log(data);
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
