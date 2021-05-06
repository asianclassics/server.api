module.exports = {
    filterObjectByKeys(obj, filterArray) {
        const keys = Object.keys(obj)
        let new_obj = {}
        filterArray.forEach((item) => {
            keys.forEach((k) => {
                // using index of to check if the object key name have a matched string
                if (k.indexOf(item) !== -1) {
                    new_obj[k] = obj[k]
                }
            })
        })
        return new_obj
    },
    filterObjectByKeysAndRemoveNulls(obj, filterArray) {
        const keys = Object.keys(obj)
        let new_obj = {}
        filterArray.forEach((item) => {
            keys.forEach((k) => {
                // using index of to check if the object key name have a matched string
                if (k.indexOf(item) !== -1 && obj[k] !== null) {
                    new_obj[k] = obj[k]
                }
            })
        })
        return new_obj
    },
}
