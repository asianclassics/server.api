const { SEARCH_FIELDS } = require('../../statics').URLparams

exports.search_fields = (params) => {
    let fields = params[SEARCH_FIELDS].split(',')
    return fields.map((x) => {
        let f = x === 'text' ? '*data*' : `*${x}*`
        return f
    })
}
