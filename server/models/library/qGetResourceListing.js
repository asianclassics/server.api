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

const { resultSetSize } = require('../../statics').elastic
const { searchFieldsInitial } = require('../../statics').elastic.fields
const {
    SEARCH_FIELDS,
    HIGHLIGHTS,
    FILTER,
    Q,
    NEAR,
    PAGE,
    PAGE_SIZE,
} = require('../../statics').URLparams
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
        createQueryFile(body, './server/log/_qGetResourceListing.txt')
    }

    return body
}

exports.getResourceListing = (params) => {
    let index = class_param(params)
    console.log(index)

    let excludes = include_data(params)

    let pageSize =
        PAGE_SIZE in params ? Number(params.page_size) : resultSetSize

    let offset = PAGE in params ? (Number(params.page) - 1) * pageSize : 0

    let fields =
        SEARCH_FIELDS in params && params[SEARCH_FIELDS] !== ''
            ? search_fields(params)
            : searchFieldsInitial

    let highlightsParam =
        HIGHLIGHTS in params ? highlights(params, fields) : null

    let filterParam =
        FILTER in params && params[FILTER] !== '' ? filter(params) : null
    console.log('filterparam', filterParam)
    //let phraseQuery = Q in params ? q(params, fields) : null

    //let proximity = NEAR in params && params[NEAR] !== '' ? near(params) : null
    let queryArrays = Q in params ? q(params, fields) : null
    //let queryArrays = buildQueryArrays(filterParam, phraseQuery, proximity)

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
}
