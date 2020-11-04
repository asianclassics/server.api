const { body } = require('express-validator')
const { client } = require('../../connection')
const { setIndex } = require('../../tools/parsers/setIndex')

// next refactor the build query section, combine model with query builder for endpoints
// maybe each endpoint is its own folder under model?
// or something else
module.exports = {
    getResource(params) {
        const index = setIndex(params)
        const { id } = params
        return client.get({ index, id })
    },
}

module.exports = {
    getResource(params) {
        const index = setIndex(params)
        const { id } = params
        return client.get({ index, id })
    },
}
