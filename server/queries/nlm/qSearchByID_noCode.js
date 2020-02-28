const { client, indices, resultSetSize } = require('../../connection')

module.exports = {
    qSearchByIDNoCode(ids, offset = 0, size = resultSetSize) {
        let idxp = indices.nlmIndexPrefix
        let sort = 'asc'
        let sortValue = 'skos:prefLabel.@value.keyword'
        let index = [`${idxp}work`, `${idxp}person`, `${idxp}topic`]
        let source = [
            '@id',
            'skos:prefLabel',
            'personName',
            'note.noteText',
            'type',
            'workCreator',
            'workIsAbout',
            '_*',
        ]
        console.log(ids[0].substring(4))

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
            s: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: ids[0].substring(4),
                                fields: [
                                    '_creator._id.keyword',
                                    'workIsAbout._id.keyword',
                                    'workGenre._id.keyword',
                                ],
                            },
                        },
                    ],
                },
            },
        }

        const body = {
            from: offset,
            size: size,
            query: query.s,
            _source: source,
        }

        if (sortValue !== null) {
            // note the [] around variable in the value being appended...?
            body.sort = [{ [sortValue]: { order: sort } }]
        }

        return client.search({ index, body })
    },
}
