const { client } = require('../../connection')
const { setFields } = require('../../tools/parsers/setFields')
const { setIndex } = require('../../tools/parsers/setIndex')
const { setFilter } = require('../../tools/parsers/setFilter')
const { setQuery } = require('../../tools/parsers/setQuery')
const { searchFieldsInitial, excludes, elastic } = require('../../statics')
const { internals } = require('@elastic/elasticsearch/lib/pool')

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

    let mainQuery = []
    if (filter !== null) {
        if (Array.isArray(filter)) {
            mainQuery = mainQuery.concat(filter)
            body.sort = [{}]
        }
    }

    if (phraseQuery !== null) {
        mainQuery.push(phraseQuery)
    }

    // if (sort !== null) {
    //     body.sort = [{ 'bibframe:role@author': { order: 'asc' } }, '_score']
    // }

    console.log('main', mainQuery)

    let bool = {
        should: {
            bool: {
                must: mainQuery,
            },
        },
        minimum_should_match: 1,
    }

    let query = {
        bool: bool,
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
