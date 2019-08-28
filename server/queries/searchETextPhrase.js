const { client, indices, type, resultSetSize } = require('../connection')

module.exports = {
    searchETextPhrase(term, offset = 0) {
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
                tags_schema: 'styled',

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

        return client.search({ index, type, body })
    },
}
