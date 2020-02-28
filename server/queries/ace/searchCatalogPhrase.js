const { client, indices, type, resultSetSize } = require('../../connection')
const { parseDefinitions } = require('../../parsers/parseDefinitions')
//const { parseFilter } = require('./parseFilter')

module.exports = {
    searchCatalogPhrase(
        definitions,
        offset = 0,
        filterClause = null,
        limiters = null
    ) {
        const index = indices.catalog
        let fields = [
            'ttltib^3',
            'ttlskt^3',
            'ttleng^3',
            'colophon',
            'authortibprimary^5',
            'authorengprimary^5',
        ]
        if (limiters) {
            let { author, title } = limiters
            if (author.on || title.on) {
                fields = []
            }
            if (author.on) {
                fields.push('authortibprimary^5', 'authorengprimary^5')
            }
            if (title.on) {
                fields.push('ttltib^3', 'ttlskt^3', 'ttleng^3')
            }
        }

        // const aggs = {
        //     'priauthtib.keyword': {
        //         terms: {
        //             size: 108,
        //             field: 'priauthtib.keyword',
        //             order: { _count: 'desc' },
        //         },
        //     },
        // }

        const clauses = parseDefinitions(definitions, fields)

        let bool

        if (!filterClause) {
            bool = {
                should: clauses,
                minimum_should_match: 1,
            }
        } else {
            bool = {
                filter: {
                    bool: { should: filterClause },
                },
                should: clauses,
                minimum_should_match: 1,
            }
        }

        const body = {
            from: offset,
            size: resultSetSize,

            query: {
                bool: bool,
            },
            highlight: {
                number_of_fragments: 0,
                fields: {
                    ttltib: {},
                    ttlskt: {},
                    ttleng: {},
                    authortibprimary: {},
                    authorengprimary: {},
                    colophon: { number_of_fragments: 100 },
                },
            },
            _source: {
                excludes: ['catnonorm', '@*', 'textfmt'],
            },
        }
        console.log('catalog search', body)
        return client.search({ index, type, body })
    },
}
