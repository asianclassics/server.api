const { client } = require('../../connection')
const { class_param, include_data } = require('../../tools/URLparams')
const { idFields } = require('../../statics')

// next refactor the build query section, combine model with query builder for endpoints
// maybe each endpoint is its own folder under model?
// or something else
module.exports = {
    getResource(params, q) {
        const index = class_param(q)
        let excludes = include_data(params, idFields)
        const body = {
            // query: {
            //     ids: {
            //         values: [params.id],
            //     },
            // },
            query: {
                multi_match: {
                    query: params.id,
                    fields: idFields,
                },
            },
            _source: {
                excludes: excludes,
            },
        }
        return client.search({ index, body })
    },
}
