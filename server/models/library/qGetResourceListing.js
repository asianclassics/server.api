const { client } = require('../../connection')
const fs = require('fs')
const {
    search_fields,
    include_data,
    filter,
    highlights,
    class_param,
    near,
    q,
} = require('../../tools/URLparams')

const { searchFieldsInitial, elastic } = require('../../statics')
const { buildQueryArrays } = require('../../tools/parsers/buildQueryArrays')

const createFileFlag = true

function createQueryBody(queryArrays, offset, pageSize, excludes, highlights) {
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

    if (highlights !== null) {
        body.highlight = highlights
    }

    if (createFileFlag) {
        fs.writeFile(`./_query.txt`, JSON.stringify(body, null, 2), (err) => {
            if (err) {
                console.log('error in file write', err)
            }
        })
    }

    return body
}

module.exports = {
    getResourceListing(params) {
        console.log('in the q')
        let index = class_param(params)

        let excludes = include_data(params)

        let pageSize =
            'page_size' in params
                ? Number(params.page_size)
                : elastic.resultSetSize

        let offset = 'page' in params ? (Number(params.page) - 1) * pageSize : 0

        let fields =
            'search_fields' in params
                ? search_fields(params)
                : searchFieldsInitial

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
