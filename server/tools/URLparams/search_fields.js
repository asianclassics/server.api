exports.search_fields = (params) => {
    let fields = params.search_fields.split(',')
    return fields.map((x) => {
        return `*${x}*`
    })
}
