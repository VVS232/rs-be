import { productList } from 'src/mocks';
import { getProduct } from '../handler';

describe('getProductById', () => {
    it('shoudld return product if list has product with passed id', () => {
        expect(getProduct(productList, '2')).toEqual({
            id: '2',
            title: 'Reaper Evil Firearrhea Hot',
            description: 'awesome product',
            price: 20,
            inStock: true
        });
        expect(getProduct(productList, '4')).toEqual({
            id: '4',
            title: 'The Toe of Satan Lollipop, .7oz.',
            description: 'awesome product',
            price: 14,
            inStock: true
        });
    });
    it('returns null if no product was found', () => {
        expect(getProduct(productList, 'foo')).toBeNull();
    });
});
