module.exports = {
    getErrorMessages(errors) {
        return errors.errors
            .map(m => [m.param, m.msg].join(': '))
            .join('  ///  ')
    },
    // using hash tables and filter
    uniq(a) {
        var prims = { boolean: {}, number: {}, string: {} },
            objs = []

        return a.filter(function(item) {
            var type = typeof item
            if (type in prims)
                return prims[type].hasOwnProperty(item)
                    ? false
                    : (prims[type][item] = true)
            else return objs.indexOf(item) >= 0 ? false : objs.push(item)
        })
    },
}
