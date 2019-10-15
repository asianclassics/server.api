const { client, indices, type, resultSetSize } = require('../connection')

module.exports = {
    searchETextPhraseTesting(term, offset = 0) {
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
        const source = {
            excludes: ['catalogingstatus', 'chklevel', 'bytecount', '@*'],
        }

        const aggregations = {
            'authortib.keyword': {
                terms: {
                    size: 108,
                    field: 'authortib.keyword',
                    order: { _count: 'desc' },
                },
                meta: {
                    color: 'blue',
                },
            },
            authortib_distinct: {
                cardinality: {
                    field: 'authortib.keyword',
                },
            },
            titletib_distinct: {
                cardinality: {
                    field: 'titletib.keyword',
                },
            },
            compositeTerms: {
                composite: {
                    size: 108,
                    sources: [
                        {
                            'authortib.keyword': {
                                terms: {
                                    field: 'authortib.keyword',
                                },
                            },
                        },
                    ],
                },
            },
        }

        const span_query = {
            span_near: {
                clauses: [
                    { span_term: { 'titletib.keyword': 'DBU' } },
                    { span_term: { 'titletib.keyword': 'TSIG' } },
                    // { span_term: { 'tibtext.keyword': 'BTANG' } },
                ],
                slop: 10,
                in_order: false,
            },
        }

        const multi_match_query = {
            multi_match: {
                query: term,
                type: 'phrase',
                fields: fields,
            },
        }

        const hlt = {
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
        }

        const body = {
            from: offset,
            size: resultSetSize,
            query: span_query,
        }
        console.log(body)
        return client.search({ index, type, body })
    },
}
