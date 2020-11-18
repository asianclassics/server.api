const { excludeFields } = require('../../statics').elastic.fields

exports.include_data = (params) => {
    if (params.include_data === 'true') {
        excludeFields = excludeFields.filter((item) => item !== '*data*')
    }
    return excludeFields
}
