module.exports = {
    parseFilter(filterClause) {
        let clauses = []
        filterClause.forEach(f => {
            //console.log(f)
            clauses.push(JSON.parse(f))
        })
        let filter = {
            bool: { should: [clauses] },
        }

        return filter
    },
}
