const { URLparams, elastic } = require('../../statics')
let { HIGHLIGHTS } = URLparams
exports.highlights = (params, fields) => {
    if (params[HIGHLIGHTS] === 'true') {
        let updatedfields = fields.concat(elastic.fields.currentProximityField)
        //console.log(updatedfields)
        let highlightFields = {}
        updatedfields.forEach((f) => {
            // workaround, here we're deleting *data* from highlighting because we specify prox field
            if (f == '*data*') {
                console.log('payloads! skip')
                return
            }
            if (f == elastic.fields.currentProximityField) {
                highlightFields[f] = {
                    //type: 'fvh',
                    //no_match_size: 150,
                    fragment_size: 150,
                    number_of_fragments: 3,
                }
            } else {
                highlightFields[f] = {}
            }
        })

        return {
            type: 'unified',
            require_field_match: 'true',
            number_of_fragments: 3,
            fragment_size: 200,
            fields: highlightFields,
        }
    }
    return null
}
