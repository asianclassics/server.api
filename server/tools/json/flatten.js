module.exports = {
    removeEmpty(obj) {
        Object.entries(obj).forEach(
            ([key, val]) =>
                (val && typeof val === 'object' && removeEmpty(val)) ||
                ((val === null || val === '') && delete obj[key])
        )
        return obj
    },
    flattenAndRemove(data) {
        var result = {}
        function recurse(cur, prop) {
            if (Object(cur) !== cur && cur !== null) {
                result[prop] = cur
            } else if (Array.isArray(cur)) {
                // if (prop === 'charges.data') {
                //     recurse(cur[0], '')
                // } else {
                for (var i = 0, l = cur.length; i < l; i++) {
                    //recurse(cur[i], prop + '[' + i + ']')
                    recurse(cur[i], prop)
                }
                // }
            } else {
                for (var p in cur) {
                    recurse(cur[p], prop ? prop + '.' + p : p)
                }
            }
        }
        recurse(data, '')
        return result
    },
    flatten(data) {
        var result = {}
        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur
            } else if (Array.isArray(cur)) {
                // if (prop === 'charges.data') {
                //     recurse(cur[0], '')
                // } else {
                for (var i = 0, l = cur.length; i < l; i++) {
                    //recurse(cur[i], prop + '[' + i + ']')
                    recurse(cur[i], prop)
                }
                // }
            } else {
                for (var p in cur) {
                    recurse(cur[p], prop ? prop + '.' + p : p)
                }
            }
        }
        recurse(data, '')
        return result
    },
    unflatten(data) {
        'use strict'
        if (Object(data) !== data || Array.isArray(data)) return data
        var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
            resultholder = {}
        for (var p in data) {
            var cur = resultholder,
                prop = '',
                m
            while ((m = regex.exec(p))) {
                cur = cur[prop] || (cur[prop] = m[2] ? [] : {})
                prop = m[2] || m[1]
            }
            cur[prop] = data[p]
        }
        return resultholder[''] || resultholder
    },
    flattenOriginal(data) {
        var result = {}
        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur
            } else if (Array.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++)
                    recurse(cur[i], prop + '[' + i + ']')
                if (l == 0) result[prop] = []
            } else {
                var isEmpty = true
                for (var p in cur) {
                    isEmpty = false
                    recurse(cur[p], prop ? prop + '.' + p : p)
                }
                if (isEmpty && prop) result[prop] = {}
            }
        }
        recurse(data, '')
        return result
    },
}
