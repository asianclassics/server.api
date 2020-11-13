const { rootFields } = require('../../statics')
module.exports = {
    setFilter(params) {
        const paramArray = params.filter.split(',')
        console.log(paramArray)
        let filterArray = paramArray.map((f) => {
            let [filterField, filterQuery] = f.split(':')
            if (filterQuery == 'exists') {
                console.log(rootFields[filterField])
                return {
                    exists: {
                        field: rootFields[filterField],
                    },
                }
            } else {
                return {
                    multi_match: {
                        query: filterQuery,
                        fields: [`*${filterField}*`],
                    },
                }
            }
        })
        return filterArray
    },
}
