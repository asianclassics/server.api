/*
Input: URL param: near
- should be structured like: term:term:term~# 
Output:
- interval array

*/
const { URLparams, elastic } = require('../../statics')
exports.near = (params) => {
    let { NEAR } = URLparams
    let proximityArray = []
    let inProx = 120

    if (params[NEAR].includes('~')) {
        ;[proximityArray, inProx] = params.near.split('~')
        inProx = Number(inProx) * 20
    } else {
        proximityArray = params.near
    }

    proximityArray = proximityArray.split(':')

    let intervalsArray = proximityArray.map((p) => {
        return {
            match: {
                query: p,
                max_gaps: 0,
                ordered: false,
            },
        }
    })

    // At this point you cannot specify which field you are doing prox search on
    // defaults to data field (like gofer)
    // we can work on ability to add field..might be interesting to be able to specify colophon for instance
    // to do this we would add the intervals to a should block in bool query

    let intervals = {
        intervals: {
            [elastic.fields.currentProximityField]: {
                all_of: {
                    ordered: false,
                    max_gaps: inProx,
                    intervals: intervalsArray,
                },
            },
        },
    }

    return intervals
}
