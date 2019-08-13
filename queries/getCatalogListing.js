const { client, indices, type } = require('../server/connection')

module.exports = {
    getCatalogListing() {
        const index = indices.catalog
        return client.search({ index, type })
    },
}
