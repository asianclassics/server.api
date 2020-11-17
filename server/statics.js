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
        itemsVersion: 'v3',
        // type: 'doc' // deprecated
    },
    searchFieldsInitial: ['*bibframe*', '*all*'],
    searchFields: [
        'title',
        'colophon',
        'variant',
        'subject',
        'person',
        'name',
        'data',
        'eng',
        'skt',
        'note',
    ],
    classFields: ['subjects', 'persons', 'works', 'items'],
    filterFields: ['author', 'subject', 'collection', 'language'],
    excludes: ['@*', '*data*'],
    rootFields: {
        subject: 'bibframe:subject',
        author: 'bibframe:role@author',
        collection: 'bibframe:collection',
        language: 'bibframe:language',
    },
    proximityFields: {
        data: 'bibframe:datasource',
        colophon: 'bibframe:varianttitle@colophon',
    },
    idFields: ['bibframe:identifier*.keyword', 'bibframe:*of*.keyword'],
}
