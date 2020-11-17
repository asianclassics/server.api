const { excludes } = require('../../statics')

exports.include_data = (params) => {
    if (params.include_data === 'true') {
        excludes = excludes.filter((item) => item !== '*data*')
    }
    return excludes
}
