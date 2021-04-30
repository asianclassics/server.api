const { Client } = require('@elastic/elasticsearch')

const client = new Client({
    cloud: {
        id: process.env.ES_CLOUD_ID,
    },
    auth: {
        username: process.env.ES_CLOUD_USER,
        password: process.env.ES_CLOUD_PASSWORD,
    },
})

module.exports = {
    client,
}
