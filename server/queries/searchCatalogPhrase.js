const { client, indices, type, resultSetSize } = require('../connection')
const { parseDefinitions } = require('./parseDefinitions')

module.exports = {
    searchCatalogPhrase(definitions, offset = 0) {
        const index = indices.catalog
        const fields = [
            'ttltib^3',
            'ttlskt^3',
            'ttleng^3',
            'colophon',
            'priauthtib^5',
            'priautheng^5',
        ]

        const clauses = parseDefinitions(definitions, fields)

        const body = {
            from: offset,
            size: resultSetSize,
            aggregations: {
                'priauthtib.keyword': {
                    terms: {
                        size: 108,
                        field: 'priauthtib.keyword',
                        order: { _count: 'desc' },
                    },
                },
            },
            query: {
                bool: {
                    should: clauses,
                },
            },
            highlight: {
                number_of_fragments: 0,
                fields: {
                    ttltib: {},
                    ttlskt: {},
                    ttleng: {},
                    priauthtib: {},
                    priautheng: {},
                    colophon: { number_of_fragments: 100 },
                },
            },
            _source: {
                excludes: ['catnonorm', '@*', 'textfmt'],
            },
        }
        //console.log('catalog search', body)
        return client.search({ index, type, body })
    },
}
