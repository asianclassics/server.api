const { client } = require('../../connection')
const { elastic } = require('../../statics')
const { parseDefinitions } = require('../../tools/parsers/parseDefinitions')
//const { parseFilter } = require('./parseFilter')

module.exports = {
    searchItemsPhrase(term, offset = 0) {
        const index = elastic.indices.catalog
        let fields = [
            'ttltib^3',
            'ttlskt^3',
            'ttleng^3',
            'title-tibetan^3',
            'title-tibetan-brief^3',
            'title-english^3',
            'title-sanskrit^3',
            'colophon',
            'authortibprimary^5',
            'authorengprimary^5',
            'primary-author-tibetan^5',
            'primary-author-english^5',
            'author-tibetan^5',
            'author-english^5',
            'author-sanskrit^5',
        ]

        // const aggs = {
        //     'priauthtib.keyword': {
        //         terms: {
        //             size: 108,
        //             field: 'priauthtib.keyword',
        //             order: { _count: 'desc' },
        //         },
        //     },
        // }

        let bool = {
            should: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: term,
                                type: 'phrase',
                                fields: fields,
                            },
                        },
                    ],
                },
            },
            minimum_should_match: 1,
        }

        const body = {
            from: offset,
            size: elastic.resultSetSize,

            query: {
                bool: bool,
            },
            highlight: {
                number_of_fragments: 0,
                fields: {
                    ttltib: {},
                    ttlskt: {},
                    ttleng: {},
                    'title-tibetan': {},
                    'title-english': {},
                    authortibprimary: {},
                    authorengprimary: {},
                    'primary-author-tibetan': {},
                    'primary-author-english': {},
                    'author-tibetan': {},
                    'author-english': {},
                    colophon: { number_of_fragments: 100 },
                },
            },
            _source: {
                excludes: ['catnonorm', '@*', 'textfmt'],
            },
        }
        console.log('items search', body)
        return client.search({ index, body })
    },
}
