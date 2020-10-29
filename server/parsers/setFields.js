const { es } = require('../connection')

module.exports = {
    setFields(params) {
        let fields =
            'search_fields' in params
                ? params.search_fields.split(',')
                : es.initialSearchFields
        return fields.map((x) => {
            return `*${x}*`
        })
    },
}
