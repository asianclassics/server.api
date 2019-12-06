module.exports = {
    parseCode(code, idxp) {
        let index
        let source
        let sortValue = null
        if (code === 'P') {
            index = idxp + 'person'
            source = ['personName', 'skos:prefLabel', 'note.noteText', '_*']
        } else if (code === 'T') {
            index = idxp + 'topic'
            source = [
                'personName',
                '@id',
                'note.noteText',
                'skos:prefLabel',
                'workCreator',
                'workIsAbout',
                '_*',
            ]
        } else if (code === 'W') {
            index = idxp + 'work'
            sortValue = 'skos:prefLabel.@value.keyword'
            source = [
                '@id',
                'note.noteText',
                'skos:prefLabel',
                'workCreator',
                'workIsAbout',
                '_*',
            ]
        }
        return [index, source, sortValue]
    },
}
