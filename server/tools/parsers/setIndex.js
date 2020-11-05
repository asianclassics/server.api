const { elastic } = require('../../statics')

module.exports = {
    setIndex(params) {
        return 'class' in params
            ? `${elastic.version}_${params.class}_test`
            : [
                  `${elastic.version}_works_test`,
                  `${elastic.version}_items_test`,
                  `${elastic.version}_subjects_test`,
                  `${elastic.version}_persons_test`,
              ]
    },
}
