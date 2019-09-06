const { client, indices, type, resultSetSize } = require('../connection')

module.exports = {
    searchCatalogPhrase(term, offset = 0) {
        const index = indices.catalog
        const fields = [
            'ttltib^3',
            'ttlskt^3',
            'ttleng^3',
            'colophon',
            'priauthtib^5',
            'priautheng^5',
        ]
        const body = {
            from: offset,
            size: resultSetSize,
            query: {
                multi_match: {
                    query: term,
                    type: 'phrase',
                    fields: fields,
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

        return client.search({ index, type, body })
    },
}
