const fs = require('fs')
const { localQueryFilePath } = require('../statics')
exports.createQueryFile = (body) => {
    fs.writeFile(localQueryFilePath, JSON.stringify(body, null, 2), (err) => {
        if (err) {
            console.log('error in file write', err)
        }
    })
}
