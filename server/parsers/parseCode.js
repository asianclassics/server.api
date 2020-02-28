module.exports = {
    parseCode(code, idxp, size = 1) {
        let index
        let source
        let sortValue = null
        if (code === 'P') {
            index = idxp + 'person'
            source = ['person*', 'has*', 'skos:prefLabel', 'type', '_*']
        } else if (code === 'T') {
            index = idxp + 'topic'
            source = [
                'personName',
                '@id',
                'skos:prefLabel',
                'type',
                'work*',
                '_*',
            ]
        } else if (code === 'G') {
            index = idxp + 'geography'
            source = ['place*', '@id', 'skos:prefLabel', 'type', 'work*', '_*']
        } else if (code === 'W') {
            index = idxp + 'work'

            source = ['@id', 'skos:prefLabel', 'type', 'work*', '_*']
        }
        if (size > 1) {
            sortValue = 'skos:prefLabel.@value.keyword'
        }
        return [index, source, sortValue]
    },
}
