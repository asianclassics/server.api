const { oneOf, check } = require('express-validator')
const { classFields } = require('../../statics').elastic.fields
const { CLASS, Q } = require('../../statics').URLparams
exports.validateClassAndQ = oneOf(
    [
        check(CLASS).custom((fields) => {
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
        check(Q)
            .isLength({ min: 2, max: 100 })
            .withMessage(
                'A {q} query must be of minimum length of 2 characters. It is required if {class} is not provided.'
            ),
    ],
    'One of {class} or {q} parameters is required for this query.'
)
