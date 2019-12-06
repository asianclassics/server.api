const { client, indices, resultSetSize } = require('../../connection')
const { parseCode } = require('../../parsers/parseCode')

module.exports = {
    qSearchByID(ids, code = 'W', offset = 0, allSource = false) {
        let sortValue = null
        let index
        let source = []
        let sort = 'asc'
        let idxp = indices.nlmIndexPrefix

        ;[index, source, sortValue] = parseCode(code, idxp)

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
        }

        if (!allSource) {
            body._source = source
        }

        if (sortValue !== null) {
            // note the [] around variable in the value being appended...?
            body.sort = [{ [sortValue]: { order: sort } }]
        }

        console.log('search by id body', code, body)

        return client.search({ index, body })
    },
}
