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

// CONNECT TO MYSQL DATABASE EXAMPLE -------------------------------------
// const { getData } = require('./server/controllers/stripe/getMySQLdata')

// const people = getData('SELECT * FROM personstbl')
// //console.log(meow)
// people.then((result) => {
//     console.log(result)
// })

module.exports = {
    client,
}
