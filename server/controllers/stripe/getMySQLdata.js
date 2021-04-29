//var database = require('../db')
const SSHConnection = require('../../db')
module.exports = {
    getData(q) {
        // async connection to database
        return SSHConnection.then((connection) => {
            // query database
            return connection
                .promise()
                .query(q)
                .then(([rows, fields]) => {
                    return rows
                })
        })
    },
}
