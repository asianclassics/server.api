module.exports = {
    setQuery(params, fields) {
        return {
            multi_match: {
                query: params.q,
                type: 'phrase',
                fields: fields,
            },
        }
    },
}
