const { rootFields } = require('../../statics')

/*
Input: URL params
Output:
- must and must_not objects

return { must: [], must_not: [] }

*/

module.exports = {
    setFilter(params) {
        let must = []
        let must_not = []

        const paramArray = params.filter.split(',')

        paramArray.forEach((f) => {
            let [filterField, filterQuery] = f.split(':')
            let mustNotFlag = filterQuery.charAt(0) == '-' ? true : false
            console.log('must not is', mustNotFlag)
            let currentFilter = {}
            if (filterQuery == 'exists') {
                currentFilter = {
                    exists: {
                        field: rootFields[filterField],
                    },
                }
            } else {
                currentFilter = {
                    multi_match: {
                        query: filterQuery,
                        fields: [`*${filterField}*`],
                    },
                }
            }

            if (mustNotFlag) {
                must_not.push(currentFilter)
            } else {
                must.push(currentFilter)
            }
        })
        console.log('yes!', must)
        console.log('not!', must_not)
        return { must: must, must_not: must_not }
    },
}
