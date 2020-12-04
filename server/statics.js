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
        libraryIndexes: {
            items: 'v4_items_test',
            works: 'v4_works_test',
            subjects: 'v4_subjects_test',
            persons: 'v4_persons_test',
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
                'text',
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
            currentProximityField: 'all:items.bibframe:datasource',
            idFields: ['bibframe:identifier*', 'all:relatedworks.bibframe:*'],
        },
    },
    URLparams: {
        SEARCH_FIELDS: 'search_fields',
        FILTER: 'filter',
        HIGHLIGHTS: 'highlights',
        NEAR: 'near',
        CLASS: 'class',
        INCLUDE_DATA: 'include_data',
        Q: 'q',
        PAGE_SIZE: 'page_size',
        PAGE: 'page',
    },
    localQueryFilePath: '_query.txt',
}
