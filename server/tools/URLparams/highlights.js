const { HIGHLIGHTS } = require('../../statics').URLparams
exports.highlights = (params, fields) => {
    if (params[HIGHLIGHTS] === 'true') {
        let updatedfields = fields.concat('bibframe:datasource')

        let highlightFields = {}
        updatedfields.forEach((f) => {
            highlightFields[f] = {}
        })

        return {
            require_field_match: 'false',
            number_of_fragments: 5,
            fragment_size: 200,
            fields: highlightFields,
        }
    }
    return null
}
