const { es } = require('../connection')

module.exports = {
    setFields(params) {
        let fields =
            'fields' in params
                ? params.fields.split(',')
                : es.initialSearchFields
        return fields.map((x) => {
            return `*${x}*`
        })
    },
}
