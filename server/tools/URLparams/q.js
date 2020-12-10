const { URLparams, elastic } = require('../../statics')
const { createQueryFile } = require('../../tools/createQueryFile')
let { Q } = URLparams

function removeParens(s) {
    return s.replace(/[()]/g, '')
}

function parseQuery(query, fields) {
    //split must include space around the word OR
    let q = query.split(' or ')
    console.log('PARSE QUERY', q)
    let queryArray = []
    q.forEach((f) => {
        f = f.trim()
        queryArray.push({
            multi_match: {
                query: f,
                type: 'phrase',
                fields: fields,
            },
        })
    })
    return queryArray
}

function parseNear(nearQ) {
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
}

function buildQuery(q, filter, fields) {
    console.log('param to parse', q)
    let qArray = q.split(',')

    let mustArray = []
    let mustNotArray = []
    let shouldArray = []

    qArray.map((d) => {
        d = d.trim()
        // NEAR -------------------------------------
        if (d.substring(0, 4) == 'near') {
            // intervals query, add to MUST
            mustArray.push(parseNear(d))
            // NOT ----------------------------------
            // note that OR within NOT is same as NOT (not(A OR B OR C)) == not A, not B, not C
        } else if (
            d.charAt(0) == '-' ||
            d.substring(0, 3).toLowerCase() == 'not'
        ) {
            d = d.charAt(0) == '-' ? d.substring(1) : d.substring(3)
            d = removeParens(d)
            mustNotArray = [...mustNotArray, ...parseQuery(d, fields)]
        } else if (d.toLowerCase().includes('or')) {
            shouldArray = [...shouldArray, ...parseQuery(d, fields)]
        } else {
            mustArray = [...mustArray, ...parseQuery(d, fields)]
        }
    })

    if (filter !== null) {
        if (Array.isArray(filter.must) && filter.must.length) {
            mustArray = mustArray.concat(filter.must)
        }

        if (Array.isArray(filter.must_not) && filter.must_not.length) {
            mustNotArray = mustNotArray.concat(filter.must_not)
        }
    }

    console.log(mustArray)

    let testQuery = {
        must: mustArray,
        must_not: mustNotArray,
    }

    if (shouldArray.length > 0) {
        testQuery.should = shouldArray
        testQuery.minimum_should_match = 1
    }

    // next write this query out in kibana
    // need to see about OR's and AND's
    // q=near(notdang:bingnot)~4,not(bzang%20or%20gshan),not%20ding,bling

    if (process.env.NODE_ENV !== 'production') {
        let writeQuery = {
            query: {
                bool: testQuery,
            },
        }
        createQueryFile(writeQuery, './server/log/_testQueryArray.txt')
    }

    return testQuery
}

exports.q = (params, filter, fields) => {
    // here we would add some intense parsing
    // we have special characters and special terms to find and parse
    // AND, OR, NOT, NEAR
    // "", (), ~
    return buildQuery(params[Q], filter, fields)
}
