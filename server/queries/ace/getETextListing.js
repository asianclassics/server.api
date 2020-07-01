const { client, es } = require('../../connection')

module.exports = {
    getETextListing() {
        const index = es.indices.etext
        return client.search({ index, type })
    },
}
