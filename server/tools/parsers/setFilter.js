module.exports = {
    setFilter(params) {
        const [filterField, filterQuery] = params.filter.split(':')
        return {
            multi_match: {
                query: filterQuery,
                fields: [`*${filterField}*`],
            },
        }
    },
}
