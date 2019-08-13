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
                fields: {
                    titletib: {},
                    titleeng: {},
                    titleskt: {},
                    authortib: {},
                    authorskt: {},
                    authoreng: {},
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
