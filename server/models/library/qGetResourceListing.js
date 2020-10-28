const { client, es } = require('../../connection')

function createQuery(params) {
    const { q } = params || {}
    console.log('createQuery params are', params)
    let fields = ['bibframe*', 'all*']
    let bool = {
        should: {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: q,
                            type: 'phrase',
                            fields: fields,
                        },
                    },
                ],
            },
        },
        minimum_should_match: 1,
    }
    const query = {
        bool: bool,
    }
    return query
}

function setIndex(params) {
    const { type } = params || {}
    console.log('setindex params are', params)
    let index = es.version + '_'
    if (type) {
        console.log('i got a value for type', type)
        //index += type
        index += 'works_test'
    } else {
        index += '*'
    }
    console.log(index)
    return index
}

module.exports = {
    getResourceListing(params) {
        const index = setIndex(params)
        const body = {
            query: createQuery(params),
            _source: {
                excludes: ['@*'],
            },
        }
        return client.search({
            index,
            body,
            //filter_path: 'hits.hits._source',
        })
    },
}
