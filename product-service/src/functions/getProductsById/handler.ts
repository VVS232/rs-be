import { Product, productList } from 'src/mocks';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const getProductById: APIGatewayProxyHandler = async (event) => {
    const { productId } = event.pathParameters;
    const product = getProduct(productList, productId);
    if (!product)
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
        body: JSON.stringify(product)
    };
};

export function getProduct(products: Product[], id: string): Product | null {
    return products.find((p) => p.id === id) || null;
}
