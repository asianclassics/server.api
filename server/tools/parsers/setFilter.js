module.exports = {
    setFilter(params) {
        const paramArray = params.filter.split(',')
        console.log(paramArray)
        let filterArray = paramArray.map((f) => {
            let [filterField, filterQuery] = f.split(':')
            return {
                multi_match: {
                    query: filterQuery,
                    fields: [`*${filterField}*`],
                },
            }
        })
        return filterArray
    },
}
