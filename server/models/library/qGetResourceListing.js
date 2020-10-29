const { client, es } = require('../../connection')

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

function setIndex(params) {
    return 'type' in params
        ? es.version + '_' + 'works_test'
        : es.version + '_' + '*'
}

function setFields(params) {
    let fields =
        'fields' in params ? params.fields.split(',') : es.initialSearchFields
    return fields.map((x) => {
        return `*${x}*`
    })
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
