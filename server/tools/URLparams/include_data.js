const { excludeFields } = require('../../statics').elastic.fields
const { INCLUDE_DATA } = require('../../statics').URLparams
exports.include_data = (params) => {
    let excludes = excludeFields
    if (params[INCLUDE_DATA] === 'true') {
        excludes = excludeFields.filter((item) => item !== '*data*')
    }
    return excludes
}
