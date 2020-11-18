const { elastic } = require('../../statics')

exports.class_param = (params) => {
    const { items, works, subjects, persons } = elastic.indexVersions

    if (!('class' in params)) {
        return [
            `${works}_works_test`,
            `${items}_items_test`,
            `${subjects}_subjects_test`,
            `${persons}_persons_test`,
        ]
    } else {
        let classArray = []

        if (params.class.includes(',')) {
            let paramArray = params.class.split(',')
            paramArray.forEach((x) => {
                classArray.push(`${elastic.indexVersions[x]}_${x}_test`)
            })
        } else {
            classArray.push(
                `${elastic.indexVersions[params.class]}_${params.class}_test`
            )
        }

        return classArray
    }
}
