const { oneOf, check } = require('express-validator')
const { searchFields, classFields } = require('../../statics')
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
}
