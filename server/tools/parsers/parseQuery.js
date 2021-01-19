let reOr = / or /gi
let reAnd = / and /gi
let reParens = /[()]/g

function removeParens(s) {
    return s.replace(reParens, '')
}

module.exports = {
    parseGrouping(query, fields) {
        let q = query.split(reOr)
        console.log('split query', q)
        let qArray = []
        let qNestedArray = []
        q.forEach((f) => {
            f = f.trim()
            f = f.removeParens(f)
            if (f.toLowerCase().includes(' and ')) {
                let qAnd = f.split(reAnd)
                console.log('split query', qAnd)
                qAnd.forEach((a) => {
                    a = a.trim()
                    a = removeParens(a)
                    qNestedArray.push(createMultiMatchObject(a, fields))
                })
            } else {
                qArray.push(createMultiMatchObject(f, fields))
            }
        })
        return [qArray, qNestedArray]
    },
}
