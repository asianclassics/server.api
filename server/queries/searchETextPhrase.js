const { client, indices, type, resultSetSize } = require('../connection')
const { parseDefinitions } = require('./parseDefinitions')

module.exports = {
    searchETextPhrase(definitions, offset = 0) {
        const index = indices.etext

        const fields = [
            'titletib^3',
            'titleeng^3',
            'titleskt^3',
            'tibtext',
            'authortib^5',
            'authorskt^5',
            'authoreng^5',
            'collection',
            'catalognumber',
        ]

        const aggregations = {
            'collection.keyword': {
                terms: {
                    field: 'collection.keyword',
                    order: { _count: 'desc' },
                },
            },
            'authortib.keyword': {
                terms: {
                    size: 108,
                    field: 'authortib.keyword',
                    order: { max_score: 'desc' },
                },
                aggregations: {
                    max_score: {
                        max: {
                            script: '_score',
                        },
                    },
                },
            },
        }

        const clauses = parseDefinitions(definitions, fields)

        const body = {
            from: offset,
            size: resultSetSize,
            aggregations: aggregations,
            query: {
                bool: {
                    should: clauses,
                },
            },
            highlight: {
                tags_schema: 'styled',
                require_field_match: false,
                fields: {
                    titletib: { number_of_fragments: 0 },
                    titleeng: { number_of_fragments: 0 },
                    titleskt: { number_of_fragments: 0 },
                    authortib: { number_of_fragments: 0 },
                    authorskt: { number_of_fragments: 0 },
                    authoreng: { number_of_fragments: 0 },
                    tibtext: {},
                },
            },
            _source: {
                excludes: ['catalogingstatus', 'chklevel', 'bytecount', '@*'],
            },
        }
        console.log(body)
        return client.search({ index, type, body })
    },
}
