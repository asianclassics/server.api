const { client, es } = require('../../connection')
const { parseCode } = require('../../parsers/parseCode')

module.exports = {
    qFetchID(ids, size = 1, code = null, allSource = false) {
        let sortValue = null
        let sort = 'asc'
        let index
        let idxp = es.indices.nlmIndexPrefix
        let source = []
        console.log('in query ids', size, ids, code, idxp)
        if (code) {
            ;[index, source, sortValue] = parseCode(code, idxp, size)
        } else {
            index = [
                `${idxp}work`,
                `${idxp}person`,
                `${idxp}topic`,
                `${idxp}geography`,
            ]
        }
        if (size > 1) {
            sortValue = '_id'
        }

        //if you need aggregation you have to use filter
        const query = {
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
            from: 0,
            size: size,
            query: query.q,
        }

        if (!allSource) {
            body._source = source
        }

        if (sortValue !== null) {
            // note the [] around variable in the value being appended...?
            body.sort = [{ [sortValue]: { order: sort } }]
        }

        console.log('fetch by id body', code, body)

        return client.search({ index, body })
    },
}
