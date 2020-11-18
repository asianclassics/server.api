const { oneOf, check } = require('express-validator')
const {
    searchFields,
    classFields,
    filterFields,
} = require('../../statics').elastic.fields
module.exports = {
    validateRequiredId: check(
        'id',
        'ID string must be provided, with minimum length of 5 characters'
    ).isLength({ min: 2, max: 40 }),
    validateClassAndQ: oneOf(
        [
            check('class').custom((fields) => {
                var e = []
                fields.split(',').map((f) => {
                    var field = f.trim()
                    if (!classFields.includes(field)) {
                        e.push(field)
                    }
                })
                if (e.length) {
                    throw new Error(`Invalid class fields: '${e.join(', ')}'`)
                }
                return true
            }),
            check('q')
                .isLength({ min: 2, max: 100 })
                .withMessage(
                    'A {q} query must be of minimum length of 2 characters. It is required if {class} is not provided.'
                ),
        ],
        'One of {class} or {q} parameters is required for this query.'
    ),
    validateSearchFields: check('search_fields')
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
        }),
    validateIncludeData: check('include_data')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('include_data parameter can only be true or false'),
    validateFilter: check('filter')
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
        }),
}
