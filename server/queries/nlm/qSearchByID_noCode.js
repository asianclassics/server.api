const { client, indices, resultSetSize } = require('../../connection')

module.exports = {
    qSearchByIDNoCode(ids, offset = 0) {
        let idxp = indices.nlmIndexPrefix
        let index = [`${idxp}work`, `${idxp}person`, `${idxp}topic`]
        let source = [
            '@id',
            'skos:prefLabel',
            'personName',
            'note.noteText',
            'workCreator',
            'workIsAbout',
            '_*',
        ]

        //if you need aggregation you have to use filter
        let query = {
            f: {
                bool: {
                    filter: [
                        {
                            ids: {
                                values: ids,
                            },
                        },
                    ],
                },
            },
            q: {
                ids: {
                    values: ids,
                },
            },
        }

        const body = {
            from: offset,
            size: resultSetSize,
            query: query.q,
            _source: source,
        }

        return client.search({ index, body })
    },
}
