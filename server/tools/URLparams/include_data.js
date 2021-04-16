const { elastic, URLparams } = require('../../statics')
exports.include_data= (params) => {
    const { excludeFields } = elastic.fields
    const { INCLUDE_DATA } = URLparams
    let excludes = excludeFields

    if (params[INCLUDE_DATA] === 'true') {
        excludes = excludeFields.filter((item) => item !== '*data*')
    }
    
    return excludes
}
