const { client } = require('../../connection')
const { createQueryFile } = require('../../tools/createQueryFile')
const {
    search_fields,
    include_data,
    filter,
    highlights,
    class_param,
    near,
    q,
} = require('../../tools/URLparams')

const { resultSetSize, searchInitial } = require('../../statics').elastic
const { buildQueryArrays } = require('../../tools/parsers/buildQueryArrays')

function createQueryBody(
    queryArrays,
    offset,
    pageSize,
    excludes,
    highlightsParam
) {
    let body = {
        from: offset,
        size: pageSize,
        query: {
            bool: queryArrays,
        },
        _source: {
            excludes: excludes,
        },
    }

    if (highlightsParam !== null) {
        body.highlight = highlightsParam
    }

    if (process.env.NODE_ENV !== 'production') {
        createQueryFile(body)
    }

    return body
}

module.exports = {
    getResourceListing(params) {
        let index = class_param(params)

        let excludes = include_data(params)

        let pageSize =
            'page_size' in params ? Number(params.page_size) : resultSetSize

        let offset = 'page' in params ? (Number(params.page) - 1) * pageSize : 0

        let fields =
            'search_fields' in params ? search_fields(params) : searchInitial

        let highlightsParam =
            'highlights' in params ? highlights(params, fields) : null

        let filterParam = 'filter' in params ? filter(params) : null
        let phraseQuery = 'q' in params ? q(params, fields) : null

        let proximity = 'near' in params ? near(params) : null

        let queryArrays = buildQueryArrays(filterParam, phraseQuery, proximity)

        let body = createQueryBody(
            queryArrays,
            offset,
            pageSize,
            excludes,
            highlightsParam
        )
        return client.search({
            index,
            body,
            //filter_path: 'hits._source',
        })
    },
}
