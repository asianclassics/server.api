const { check } = require('express-validator')
exports.validateRequiredId = check(
    'id',
    'ID string must be provided, with minimum length of 5 characters'
).isLength({ min: 2, max: 40 })
