const { client, es } = require('../../connection')

let initialFields = ['bibframe', 'all']

function createQuery(params, fields) {
    const { q } = params || {}
    console.log('createQuery params are', params)

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

// function setIndex(params) {
//     const { type } = params || {}
//     console.log('setindex params are', params)
//     let index = es.version + '_'
//     if (type) {
//         console.log('i got a value for type', type)
//         //index += type
//         index += 'works_test'
//     } else {
//         index += '*'
//     }
//     console.log(index)
//     return index
// }

function setFields(params) {
    let fields = 'fields' in params ? params.fields.split(',') : initialFields
    return fields.map((x) => {
        return `*${x}*`
    })
}

module.exports = {
    getResourceListing(params) {
        console.log('in listing', params)
        const index =
            'type' in params
                ? es.version + '_' + 'works_test'
                : es.version + '_' + '*'
        console.log(index)
        let fields = setFields(params)

        console.log(fields)
        const body = {
            query: 'q' in params ? createQuery(params, fields) : '',
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
