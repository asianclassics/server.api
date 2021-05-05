const fs = require('fs')
const { queryFilePaths } = require('../statics')
exports.createQueryFile = (body, fileName) => {
    let logFilePath =
        process.env.NODE_ENV !== 'production'
            ? queryFilePaths.development
            : queryFilePaths.production
    logFilePath = `${logFilePath}/${fileName}`
    fs.writeFile(logFilePath, JSON.stringify(body, null, 2), (err) => {
        if (err) {
            console.log('error in file write', err)
        }
    })
}
