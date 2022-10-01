export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    inStock: boolean;
};
export const productList: Product[] = [
    {
        id: '1',
        title: 'Pepper Extract, 5oz.',
        description: 'awesome product',
        price: 10,
        inStock: true
    },
    {
        id: '2',
        title: 'Reaper Evil Firearrhea Hot',
        description: 'awesome product',
        price: 20,
        inStock: true
    },
    {
        id: '3',
        title: 'Torchbearer Reaper Evil Hot',
        description: 'awesome product',
        price: 30,
        inStock: true
    },
    {
        id: '4',
        title: 'The Toe of Satan Lollipop, .7oz.',
        description: 'awesome product',
        price: 14,
        inStock: true
    },
    {
        id: '5',
        title: "Blair's Sudden Death Sauce",
        description: 'awesome product',
        price: 12,
        inStock: true
    },
    {
        id: '6',
        title: "CaJohn's Trouble Bubble Gum",
        description: 'awesome product',
        price: 12,
        inStock: true
    }
];
