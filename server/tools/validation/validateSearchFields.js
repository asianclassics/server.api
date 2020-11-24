const { check } = require('express-validator')
const { searchFields } = require('../../statics').elastic.fields
const { SEARCH_FIELDS } = require('../../statics').URLparams
exports.validateSearchFields = check(SEARCH_FIELDS)
    .optional()
    .custom((fields) => {
        var e = []
        fields.split(',').map((f) => {
            var field = f.trim()
            if (!searchFields.includes(field)) {
                e.push(field)
            }
        })
        if (e.length) {
            throw new Error(`Invalid search fields: '${e.join(', ')}'`)
        }
        return true
    })
