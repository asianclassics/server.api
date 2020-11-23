const { check } = require('express-validator')
const { searchFields } = require('../../statics').elastic.fields
const { search_fields } = require('../../statics').URLparams

exports.validateSearchFieldsAlt = check(search_fields)
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
