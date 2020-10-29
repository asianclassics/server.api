const { es } = require('../connection')

module.exports = {
    setIndex(params) {
        return 'type' in params
            ? es.version + '_' + 'works_test'
            : es.version + '_' + 'works_test'
    },
}
