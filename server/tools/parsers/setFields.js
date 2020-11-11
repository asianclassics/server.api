module.exports = {
    setFields(params) {
        let fields = params.search_fields.split(',')
        return fields.map((x) => {
            return `*${x}*`
        })
    },
}
