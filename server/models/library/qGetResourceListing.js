const { client } = require('../../connection')
const { setFields } = require('../../tools/parsers/setFields')
const { setIndex } = require('../../tools/parsers/setIndex')

function createQuery(params, fields) {
    let excludes = ['@*', '*data*']
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

    if ('q' in params) {
        let bool = {
            should: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: params.q,
                                type: 'phrase',
                                fields: fields,
                            },
                        },
                    ],
                },
            },
            minimum_should_match: 1,
        }

        let query = {
            bool: bool,
        }

        body.query = query
    }

    return body
}

module.exports = {
    getResourceListing(params) {
        let index = setIndex(params)
        let fields = setFields(params)
        console.log(fields, index)
        let body = createQuery(params, fields)
        console.log(body)
        return client.search({
            index,
            body,
            //filter_path: 'hits.hits._source',
        })
    },
}
