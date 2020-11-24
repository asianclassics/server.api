const { check } = require('express-validator')
const { filterFields } = require('../../statics').elastic.fields
const { FILTER } = require('../../statics').URLparams

exports.validateFilter = check(FILTER)
    .optional()
    .contains(':')
    .withMessage(`Filter parameter must contain a ':' character.`)
    .custom((filter) => {
        var e = []
        filter.split(',').map((f) => {
            var field = f.trim()
            var [filterField, _] = field.split(':')
            if (!filterFields.includes(filterField)) {
                e.push(field)
            }
        })
        if (e.length) {
            throw new Error(
                `Invalid filter fields: '${e.join(
                    ', '
                )}'. Options are: ${filterFields}`
            )
        }
        return true
    })
