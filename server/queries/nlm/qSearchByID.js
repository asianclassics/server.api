const { client, es } = require('../../connection')
const { parseCode } = require('../../parsers/parseCode')

module.exports = {
    qSearchByID(ids, code = 'W', offset = 0, size = 20) {
        let sortValue = null
        let sort = 'asc'
        let idxp = es.indices.nlmIndexPrefix
        let index = [`${idxp}work`, `${idxp}person`, `${idxp}topic`]

        console.log('in query ids', ids, code, idxp)
        //;[index, source, sortValue] = parseCode(code, idxp)

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
            from: offset,
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

        console.log('search by id body', code, body)

        return client.search({ index, body })
    },
}
