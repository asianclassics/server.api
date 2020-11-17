module.exports = {
    buildQueryArrays(filter, phraseQuery, proximity) {
        let mustArray = []
        let mustNotArray = []
        if (filter !== null) {
            if (Array.isArray(filter.must) && filter.must.length) {
                mustArray = mustArray.concat(filter.must)
            }

            if (Array.isArray(filter.must_not) && filter.must_not.length) {
                mustNotArray = mustNotArray.concat(filter.must_not)
            }
        }

        if (phraseQuery !== null) {
            mustArray.push(phraseQuery)
        }

        if (proximity !== null) {
            mustArray.push(proximity)
        }

        console.log('the must?', mustArray)

        return {
            must: mustArray,
            must_not: mustNotArray,
        }
    },
}
