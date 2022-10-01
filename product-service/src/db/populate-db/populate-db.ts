import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
var ddb = new DynamoDB({ apiVersion: '2012-08-10' });
const PRODUCTS_TABLE = 'rs-product';
const products = [
    {
        id: uuidv4(),
        title: 'Pepper Extract, 5oz.',
        description: 'awesome product',
        price: '10'
    },
    {
        id: uuidv4(),
        title: 'Reaper Evil Firearrhea Hot',
        description: 'awesome product',
        price: '11'
    },
    {
        id: uuidv4(),
        title: 'Torchbearer Reaper Evil Hot',
        description: 'awesome product',
        price: '22'
    },
    {
        id: uuidv4(),
        title: 'The Toe of Satan Lollipop, .7oz.',
        description: 'awesome product',
        price: '67'
    },
    {
        id: uuidv4(),
        title: "CaJohn's Trouble Bubble Gum",
        description: 'awesome product',
        price: '13'
    },
    {
        id: uuidv4(),
        title: "Blair's Sudden Death Sauce",
        description: 'awesome product',
        price: '26'
    }
];
const STOCK_TABLE = 'rs-stock';
const stock = products.map((p, i) => ({
    product_id: p.id,
    count: (i + 1).toString()
}));
const dataToWrite: BatchWriteCommandInput = {
    RequestItems: {
        [PRODUCTS_TABLE]: products.map((d) => ({
            PutRequest: {
                Item: {
                    id: { S: d.id },
                    title: { S: d.title },
                    description: { S: d.description },
                    price: { N: d.price }
                }
            }
        })),
        [STOCK_TABLE]: stock.map((s) => ({
            PutRequest: {
                Item: {
                    product_id: { S: s.product_id },
                    count: { N: s.count }
                }
            }
        }))
    }
};
export const putItem = async () => {
    try {
        const data = await ddb.batchWriteItem(dataToWrite);
        console.log('Success - item added or updated', data);
    } catch (err) {
        console.log('Error', err);
    }
};
putItem();
