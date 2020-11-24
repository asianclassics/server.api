const { check } = require('express-validator')
const { INCLUDE_DATA } = require('../../statics').URLparams
exports.validateIncludeData = check(INCLUDE_DATA)
    .optional()
    .isIn(['true', 'false'])
    .withMessage('include_data parameter can only be true or false')
