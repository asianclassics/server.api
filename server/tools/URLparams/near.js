const { proximityFields } = require('../../statics')

/*
Input: URL param: near
- should be structured like: term:term:term~# 
Output:
- interval array

*/

exports.near = (params) => {
    let proximityArray = []
    let inProx = 120

    console.log('prox!')

    if (params.near.includes('~')) {
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

    let intervals = {
        intervals: {
            'bibframe:datasource': {
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
