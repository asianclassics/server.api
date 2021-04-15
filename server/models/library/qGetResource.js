const { client } = require('../../connection')
const { class_param, include_data } = require('../../tools/URLparams')
const { idFields } = require('../../statics').elastic.fields
const { INCLUDE_RELATED } = require('../../statics').URLparams
const { createQueryFile } = require('../../tools/createQueryFile')

// next refactor the build query section, combine model with query builder for endpoints
// maybe each endpoint is its own folder under model?
// or something else
module.exports = {
    getResource(paramsPath, paramsQuery) {
        const index = class_param(paramsQuery)
        const excludes = include_data(paramsQuery)
        const related = INCLUDE_RELATED in paramsQuery && String(paramsQuery[INCLUDE_RELATED]).toLowerCase() == "true" ? true : false
        let q = {}
        if(related) {
            q = {
                multi_match: {
                    query: paramsPath.id,
                    fields: idFields,
                },
            }
        } else {
            q = {
                ids: {
                    values: [paramsPath.id],
                },
            }
        }
        const body = {
            query: q,
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
