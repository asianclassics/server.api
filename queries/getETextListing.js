const { client, indices, type } = require('../server/connection')

module.exports = {
    getETextListing() {
        const index = indices.etext
        return client.search({ index, type })
    },
}
