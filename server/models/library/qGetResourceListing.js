const { client } = require('../../connection')
const { setFields } = require('../../tools/parsers/setFields')
const { setIndex } = require('../../tools/parsers/setIndex')
const { setFilter } = require('../../tools/parsers/setFilter')
const { setQuery } = require('../../tools/parsers/setQuery')
const { searchFieldsInitial, excludes, elastic } = require('../../statics')

function createQuery(params, filter, phraseQuery, offset, pageSize, sort) {
    if ('include_data' in params) {
        if (params.include_data === 'true') {
            excludes = excludes.filter((item) => item !== '*data*')
        }
    }
    let body = {
        from: offset,
        size: pageSize,
        _source: {
            excludes: excludes,
        },
    }

    let mustArray = []
    let mustNotArray = []
    if (filter !== null) {
        console.log('must', filter.must)
        console.log('must_not', filter.must_not)
        if (Array.isArray(filter.must) && filter.must.length) {
            mustArray = mustArray.concat(filter.must)
            body.sort = [{}]
        }

        if (Array.isArray(filter.must_not) && filter.must_not.length) {
            mustNotArray = mustNotArray.concat(filter.must_not)
        }
    }

    if (phraseQuery !== null) {
        mustArray.push(phraseQuery)
    }

    // if (sort !== null) {
    //     body.sort = [{ 'bibframe:role@author': { order: 'asc' } }, '_score']
    // }

    console.log('must', mustArray)
    console.log('must_not', mustNotArray)

    let bool = {
        should: {
            bool: {
                must: mustArray,
                must_not: mustNotArray,
            },
        },
        minimum_should_match: 1,
    }

    let bool2 = {
        must: mustArray,
        must_not: mustNotArray,
    }

    let query = {
        bool: bool2,
    }

    body.query = query

    return body
}

module.exports = {
    getResourceListing(params) {
        let index = setIndex(params)
        let pageSize =
            'page_size' in params
                ? Number(params.page_size)
                : elastic.resultSetSize

        let offset = 'page' in params ? (Number(params.page) - 1) * pageSize : 0

        // let sort = 'sort' in params ? params.sort : null

        let fields =
            'search_fields' in params ? setFields(params) : searchFieldsInitial

        let filter = 'filter' in params ? setFilter(params) : null
        let phraseQuery = 'q' in params ? setQuery(params, fields) : null
        let body = createQuery(params, filter, phraseQuery, offset, pageSize)
        return client.search({
            index,
            body,
            //filter_path: 'hits.hits._source',
        })
    },
}
