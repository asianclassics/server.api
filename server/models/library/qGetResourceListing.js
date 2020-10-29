const { client } = require('../../connection')
const { setFields } = require('../../parsers/setFields')
const { setIndex } = require('../../parsers/setIndex')

function createQuery(params, fields) {
    let body = {
        _source: {
            excludes: ['@*'],
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

        let body = createQuery(params, fields)

        return client.search({
            index,
            body,
            //filter_path: 'hits.hits._source',
        })
    },
}
