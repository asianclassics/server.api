const { client } = require('../../connection')
const { setIndex } = require('../../tools/parsers/setIndex')

// next refactor the build query section, combine model with query builder for endpoints
// maybe each endpoint is its own folder under model?
// or something else
module.exports = {
    getResource(params, q) {
        const index = setIndex(q)
        let excludes = ['@*', '*data*']
        if ('include_data' in q) {
            if (q.include_data === 'true') {
                excludes = excludes.filter((item) => item !== '*data*')
            }
        }
        const body = {
            query: {
                ids: {
                    values: [params.id],
                },
            },
            _source: {
                excludes: excludes,
            },
        }
        return client.search({ index, body })
    },
}
