const { elastic } = require('../../statics')

module.exports = {
    setIndex(params) {
        return 'class' in params
            ? elastic.version + '_' + 'works_test'
            : elastic.version + '_' + 'works_test'
    },
}
