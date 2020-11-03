const { oneOf, check } = require('express-validator')

module.exports = {
    validateClassAndQ: oneOf(
        [
            check('class')
                .isIn(['subjects', 'persons', 'works', 'items'])
                .withMessage(
                    'Type can be one of: subjects, persons, works, items'
                ),
            check('q')
                .isLength({ min: 2, max: 100 })
                .withMessage(
                    'A {q} query must be of minimum length of 2 characters. It is required if {class} is not provided.'
                ),
        ],
        'One of {class} or {q} parameters is required for this query.'
    ),
    validateSearchFields: check('search_fields').isIn([
        'title',
        'subject',
        'person',
    ]),
}
