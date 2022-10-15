export default {
    type: 'object',
    title: 'create product schema',
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        count: { type: 'integer' }
    },
    required: ['title', 'description', 'count', 'price']
} as const;
