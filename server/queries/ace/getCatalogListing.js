const { client, indices, type } = require('../../connection')

module.exports = {
    getCatalogListing() {
        const index = indices.catalog
        return client.search({ index, type })
    },
}
