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
        indexVersions: {
            items: 'v4',
            works: 'v2',
            subjects: 'v4',
            persons: 'v4',
        },
        // type: 'doc' // deprecated
        fields: {
            searchFieldsInitial: ['*bibframe*', '*all*'],
            searchFields: [
                'title',
                'colophon',
                'variant',
                'subject',
                'person',
                'author',
                'name',
                'data',
                'eng',
                'skt',
                'note',
            ],
            classFields: ['subjects', 'persons', 'works', 'items'],
            filterFields: ['author', 'subject', 'collection', 'language'],
            excludeFields: ['@*', '*data*'],
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
            idFields: [
                'bibframe:identifier*.keyword',
                'all:works.bibframe:*.keyword',
            ],
        },
    },
    localQueryFilePath: '_query.txt',
}
