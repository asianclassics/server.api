const { elastic } = require('../../statics')

exports.class_param = (params) => {
    // this whole function can be refactored once we get stable indexes
    let v = elastic.version
    if (params.class == 'items') {
        v = elastic.itemsVersion
    }

    return 'class' in params
        ? `${v}_${params.class}_test`
        : [
              `${elastic.version}_works_test`,
              `${elastic.itemsVersion}_items_test`,
              `${elastic.version}_subjects_test`,
              `${elastic.version}_persons_test`,
          ]
}
