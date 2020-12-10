const { SEARCH_FIELDS } = require('../../statics').URLparams
const { currentProximityField } = require('../../statics').elastic.fields

exports.search_fields = (params) => {
    let fields = params[SEARCH_FIELDS].split(',')
    return fields.map((x) => {
        console.log(x)
        return 'data' ? currentProximityField : `*${x}*`
    })
}
