const { client } = require('../../connection')
const { elastic } = require('../../statics')
const { parseDefinitions } = require('../../tools/parsers/parseDefinitions')
const { parseFilter } = require('../../tools/parsers/parseFilter')
const { createQueryFile } = require('../../tools/createQueryFile')
const fs = require('fs')

module.exports = {
    searchETextPhrase(
        definitions,
        offset = 0,
        filterClause = null,
        limiters = null
    ) {
        const index = elastic.indices.etext

        let fields = [
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
        if (limiters) {
            let { author, title } = limiters
            if (author.on || title.on) {
                fields = []
                if (author.on) {
                    fields.push('authortib^5', 'authorskt^5', 'authoreng^5')
                }
                if (title.on) {
                    fields.push('titletib^3', 'titleeng^3', 'titleskt^3')
                }
            }
        }

        // const aggregations = {
        //     collections: {
        //         terms: {
        //             field: 'collection.keyword',
        //             order: { _count: 'desc' },
        //         },
        //     },
        //     authors: {
        //         terms: {
        //             size: 108,
        //             field: 'authortib.keyword',
        //             order: { max_score: 'desc' },
        //         },
        //         aggregations: {
        //             max_score: {
        //                 max: {
        //                     script: '_score',
        //                 },
        //             },
        //         },
        //     },
        // }

        const clauses = parseDefinitions(definitions, fields)
        let bool
        //console.log('filterclaus!', filterClause)
        if (!filterClause) {
            bool = {
                should: clauses,
                minimum_should_match: 1,
            }
        } else {
            //let parsedClauses = parseFilter(filterClause)
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
            size: elastic.resultSetSize,
            //aggregations: aggregations,
            query: {
                bool: bool,
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

        createQueryFile(body, '_ace_etextphrase.txt')

        return client.search({ index, body })
    },
}
