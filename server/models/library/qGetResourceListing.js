const { client } = require('../../connection')
const { setFields } = require('../../tools/parsers/setFields')
const { setIndex } = require('../../tools/parsers/setIndex')
const { setFilter } = require('../../tools/parsers/setFilter')
const { setQuery } = require('../../tools/parsers/setQuery')
const { searchFieldsInitial, excludes } = require('../../statics')

function createQuery(params, filter, phraseQuery) {
    if ('include_data' in params) {
        if (params.include_data === 'true') {
            excludes = excludes.filter((item) => item !== '*data*')
        }
    }
    let body = {
        _source: {
            excludes: excludes,
        },
    }

    let mainQuery = []
    if (filter !== null) {
        if (Array.isArray(filter)) {
            mainQuery = mainQuery.concat(filter)
        } else {
            mainQuery.push(filter)
        }
    }

    if (phraseQuery !== null) {
        mainQuery.push(phraseQuery)
    }

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
        let fields =
            'search_fields' in params ? setFields(params) : searchFieldsInitial
        console.log(fields)
        let filter = 'filter' in params ? setFilter(params) : null
        let phraseQuery = 'q' in params ? setQuery(params, fields) : null
        let body = createQuery(params, filter, phraseQuery)
        return client.search({
            index,
            body,
            //filter_path: 'hits.hits._source',
        })
    },
}
