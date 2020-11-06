const { client } = require('../../connection')
const { elastic } = require('../../statics')
const { parseCode } = require('../../tools/parsers/parseCode')

module.exports = {
    qFetchByCode(code = 'W', offset = 0, allSource = false) {
        let sortValue = null
        let index
        let source = []
        let sort = 'asc'
        let idxp = elastic.indices.nlmIndexPrefix
        let query = {
            match_all: {},
        }

        if (code === 'W') {
            query = {
                bool: {
                    must_not: {
                        exists: {
                            field: 'workPartOf',
                        },
                    },
                    must: {
                        term: {
                            _distance: 0,
                        },
                    },
                },
            }
        } else {
            query = {
                bool: {
                    must: {
                        term: {
                            _distance: 1,
                        },
                    },
                },
            }
        }

        ;[index, source, sortValue] = parseCode(code, idxp)

        const body = {
            from: offset,
            size: elastic.resultSetSize,
            query: query,
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
