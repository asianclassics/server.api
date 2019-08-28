const { client, indices, type } = require('../connection')

module.exports = {
    getFullTextAndSearch(id, term) {
        const index = indices.etext
        const body = {
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
                    must: [
                        {
                            multi_match: {
                                query: term,
                                type: 'phrase',
                                fields: ['tibtext'],
                            },
                        },
                    ],
                },
            },
            _source: false,
        }
        return client.search({ index, type, body })
    },
}
