const { client, es } = require('../../connection')

module.exports = {
    getCatalogListing() {
        const index = es.indices.catalog
        return client.search({ index })
    },
}
