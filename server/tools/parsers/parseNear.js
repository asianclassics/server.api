const { elastic } = require('../../statics')
module.exports = {
    parseNear(nearQ) {
        //console.log('PARSE NEAR', q)
        let q = nearQ.replace(/[()]/g, '').replace('near', '')
        //x = x.replace('near', '')

        let proximityArray = []
        let inProx = 120

        if (q.includes('~')) {
            ;[proximityArray, inProx] = q.split('~')
            inProx = Number(inProx) * 20
        } else {
            proximityArray = q
        }

        proximityArray = proximityArray.split(':')
        console.log(proximityArray, inProx)

        let intervalsArray = proximityArray.map((p) => {
            return {
                match: {
                    query: p,
                    max_gaps: 0,
                    ordered: true,
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
        //console.log(intervals, intervalsArray)
        return intervals
    },
}
