const { client } = require('../../connection')
const { elastic } = require('../../statics')

module.exports = {
    getCatalogListing() {
        const index = elastic.indices.catalog
        return client.search({ index })
    },
}
