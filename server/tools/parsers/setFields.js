const { searchFieldsInitial } = require('../../statics')

module.exports = {
    setFields(params) {
        let fields =
            'search_fields' in params
                ? params.search_fields.split(',')
                : searchFieldsInitial
        return fields.map((x) => {
            return `*${x}*`
        })
    },
}
