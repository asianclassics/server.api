const { client, indices, resultSetSize } = require('../../connection')
const { parseCode } = require('../../parsers/parseCode')

module.exports = {
    qFetchByCode(code = 'W', offset = 0, allSource = false) {
        let sortValue = null
        let index
        let source = []
        let sort = 'asc'
        let idxp = indices.nlmIndexPrefix

        ;[index, source, sortValue] = parseCode(code, idxp)

        const body = {
            from: offset,
            size: resultSetSize,
        }

        if (!allSource) {
            body._source = source
        }

        if (sortValue !== null) {
            // note the [] around variable in the value being appended...?
            body.sort = [{ [sortValue]: { order: sort } }]
        }

        return client.search({ index, body })
    },
}
