const { client } = require('../../connection')
const { elastic } = require('../../statics')

module.exports = {
    getETextListing() {
        const index = elastic.indices.etext
        return client.search({ index, type })
    },
}
