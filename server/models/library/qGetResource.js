const { client } = require('../../connection')
const { class_param, include_data } = require('../../tools/URLparams')
const { idFields } = require('../../statics').elastic.fields
const { createQueryFile } = require('../../tools/createQueryFile')

// next refactor the build query section, combine model with query builder for endpoints
// maybe each endpoint is its own folder under model?
// or something else
module.exports = {
    getResource(paramsPath, paramsQuery) {
        const index = class_param(paramsQuery)
        const excludes = include_data(paramsQuery)
        const body = {
            // query: {
            //     ids: {
            //         values: [params.id],
            //     },
            // },
            query: {
                multi_match: {
                    query: paramsPath.id,
                    fields: idFields,
                },
            },
            _source: {
                excludes: excludes,
            },
        }

        // send query to text file if local dev
        if (process.env.NODE_ENV !== 'production') {
            createQueryFile(body, './server/log/_qGetResource.txt')
        }

        return client.search({ index, body })
    },
}
