const { elastic, URLparams } = require('../../statics')
exports.class_param = (params) => {
    let { CLASS } = URLparams
    let { libraryIndexes } = elastic

    if (!(CLASS in params)) {
        return libraryIndexes.works
    } else {
        let classArray = []

        if (params[CLASS].includes(',')) {
            let paramArray = params[CLASS].split(',')
            paramArray.forEach((x) => {
                classArray.push(libraryIndexes[x])
            })
        } else {
            classArray.push(libraryIndexes[params[CLASS]])
        }
        //console.log('class', classArray)
        return classArray
    }
}
