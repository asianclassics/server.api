const { rootFields } = require('../../statics').elastic.fields
const { FILTER } = require('../../statics').URLparams
/*
Input: URL params
Output:
- must and must_not objects

return { must: [], must_not: [] }

*/

exports.filter = (params) => {
    let must = []
    let must_not = []

    const paramArray = params[FILTER].split(',')

    paramArray.forEach((f) => {
        let mustNotFlag = false
        let [filterField, filterQuery] = f.split(':')
        if (filterQuery.charAt(0) == '-') {
            mustNotFlag = true
            filterQuery = filterQuery.substring(1)
        }

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

    return { must: must, must_not: must_not }
}
