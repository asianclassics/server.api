const { Q } = require('../../statics').URLparams
exports.q = (params, fields) => {
    return {
        multi_match: {
            query: params[Q],
            type: 'phrase',
            fields: fields,
        },
    }
}
