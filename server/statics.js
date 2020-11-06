module.exports = {
    // Core ES variables for this project
    elastic: {
        indices: {
            catalog: 'v1_acip_catalogs',
            etext: 'v2_acip_etexts',
            nlmIndex: 'v1_bdrc_work',
            nlmIndexPrefix: 'v1_bdrc_',
            resources: 'v2_works_test',
        },
        resultSetSize: 10,
        version: 'v2',
        // type: 'doc' // deprecated
    },
    searchFieldsInitial: ['bibframe', 'all'],
    searchFields: ['title', 'subject', 'colophon', 'person', 'name', 'data'],
    classFields: ['subjects', 'persons', 'works', 'items'],
}