module.exports = {
    parseFilterTerms(filterClause) {
        let genre = 'workGenre._value.keyword'
        let subject = 'workIsAbout._value.keyword'
        let author = '_creator._value.keyword'

        function setFilterType(filterType) {
            if (filterType === 'genre') {
                return genre
            } else if (filterType === 'subject') {
                return subject
            } else if (filterType === 'author') {
                return author
            }
        }
        //let fClauses = JSON.parse(filterClause)
        //console.log('parsed', fClauses)

        let clauses = []
        filterClause.forEach(f => {
            //console.log(f)
            let ff = JSON.parse(f)
            let t = setFilterType(ff.type)
            let filter = {
                term: {
                    [t]: ff.label,
                },
            }
            clauses.push(filter)
        })
        console.log('p', clauses)

        let filter = {
            bool: { must: clauses },
        }

        return filter
    },
}
