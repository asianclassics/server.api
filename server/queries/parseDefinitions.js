module.exports = {
    parseDefinitions(definitions, fields) {
        let must = []
        let should = []
        let must_not = []
        let clauses = []

        definitions.forEach(def => {
            should = []
            must = []
            must_not = []

            Object.entries(JSON.parse(def)).forEach(entry => {
                if (Array.isArray(entry[1])) {
                    if (entry[0] === 'AND') {
                        entry[1].map(a => {
                            must.push({
                                multi_match: {
                                    query: a,
                                    type: 'phrase',
                                    fields: fields,
                                },
                            })
                        })
                    } else if (entry[0] === 'NOT') {
                        entry[1].map(a => {
                            must_not.push({
                                multi_match: {
                                    query: a,
                                    type: 'phrase',
                                    fields: fields,
                                },
                            })
                        })
                    }
                    // else if (entry[0] === 'OR') {
                    //     entry[1].map(a => {
                    //         should.push({
                    //             multi_match: {
                    //                 query: a,
                    //                 type: 'phrase',
                    //                 fields: fields,
                    //             },
                    //         })
                    //     })
                    // }
                }
            })
            clauses.push({ bool: { must: must, must_not: must_not } })
        })
        return clauses
    },
}
