const { client, indices, type } = require('../connection')
const { parseDefinitions } = require('./parseDefinitions')

module.exports = {
    getFullTextAndSearch(id, definitions) {
        console.log(definitions)
        const index = indices.etext
        const fields = ['tibtext']
        const clauses = parseDefinitions(definitions, fields)
        const body = {
            terminate_after: 1,
            highlight: {
                fields: {
                    tibtext: {},
                },
                tags_schema: 'styled',
                number_of_fragments: 0,
            },
            query: {
                bool: {
                    filter: {
                        ids: {
                            values: [id],
                        },
                    },
                    should: clauses,
                },
            },
            _source: false,
        }
        console.log(body)
        return client.search({ index, type, body })
    },
}
