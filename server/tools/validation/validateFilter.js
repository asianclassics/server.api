const { check } = require('express-validator')
const { filterFields } = require('../../statics').elastic.fields
const { FILTER } = require('../../statics').URLparams

// .contains(':')
//     .withMessage(`Filter parameter must contain a ':' character.`)

exports.validateFilter = check(FILTER)
    .optional()
    .custom((filter) => {
        var e = []
        var noSplit = false
        filter.split(',').map((f) => {
            console.log('val for filter', f)
            if (f == '') return true
            var field = f.trim()

            var [filterField, _] = field.split(':')

            if (!filterFields.includes(filterField)) {
                e.push(field)
            }
            if (!field.includes(':')) {
                noSplit = true
            }
        })
        if (e.length) {
            throw new Error(
                `Invalid filter fields: '${e.join(
                    ', '
                )}'. Options are: ${filterFields}`
            )
        }
        if (noSplit)
            throw new Error(
                `Required format of [filter]:value => Options for filter are: ${filterFields}.`
            )
        return true
    })
