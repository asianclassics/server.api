const { URLparams } = require('../../statics')
const { createQueryFile } = require('../../tools/createQueryFile')
const { parseNear } = require('../parsers/parseNear')
let { Q } = URLparams

let reOr = / or /gi
let reAnd = / and /gi
let reParens = /[()]/g

function removeParens(s) {
    return s.replace(reParens, '')
}

function createMultiMatchObject(query, fields) {
    let a = {
        multi_match: {
            query: query,
            type: 'phrase',
            fields: fields,
        },
    }

    return a
}

function parseQuery(query, fields, splitter) {
    //split must include space around the word OR
    let q = query.split(splitter)
    //console.log('split query', q)
    let queryArray = []
    q.forEach((f) => {
        f = f.trim()
        queryArray.push(createMultiMatchObject(f, fields))
    })
    return queryArray
}

exports.q = (params, filter, fields) => {
    //return buildQuery(params[Q], filter, fields)
    let q = params[Q]

    let mustArray = []
    let mustNotArray = []
    let shouldArray = []
    let nestedShouldArray = []
    let tempArray = []

    //console.log('param to parse', q)

    let qArray = q.split(',')

    qArray
        .filter((d) => d !== '')
        .map((d) => {
            d = d.trim()
            // NEAR -------------------------------------
            if (d.substring(0, 4).toLowerCase() == 'near') {
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

                tempArray = mustNotArray = [
                    ...mustNotArray,
                    ...parseQuery(d, fields, reOr),
                ]
            } else if (d.toLowerCase().includes(' or ')) {
                let q = d.split(reOr)
                //console.log('split query', q)
                q.forEach((f) => {
                    f = f.trim()
                    f = removeParens(f)
                    //console.log(f)
                    if (f.toLowerCase().includes(' and ')) {
                        let qAnd = f.split(reAnd)
                        //console.log('split query', qAnd)
                        qAnd.forEach((a) => {
                            a = a.trim()
                            a = removeParens(a)
                            nestedShouldArray.push(
                                createMultiMatchObject(a, fields)
                            )
                        })
                    } else {
                        shouldArray.push(createMultiMatchObject(f, fields))
                    }
                })
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

    let testQuery = {
        must: mustArray,
        must_not: mustNotArray,
    }

    if (nestedShouldArray.length > 0) {
        shouldArray.push({
            bool: {
                must: nestedShouldArray,
            },
        })
    }

    if (shouldArray.length > 0) {
        testQuery.should = shouldArray
        testQuery.minimum_should_match = 1
    }

    // next write this query out in kibana
    // need to see about OR's and AND's
    // q=near(notdang:bingnot)~4,not(bzang%20or%20gshan),not%20ding,bling

    let writeQuery = {
        query: {
            bool: testQuery,
        },
    }

    createQueryFile(writeQuery, '_library_q_QueryArray.txt')

    return testQuery
}
