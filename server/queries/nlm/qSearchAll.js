const { client, indices, resultSetSize } = require('../../connection')
const { parseFilterTerms } = require('../../parsers/parseFilterTerms')
module.exports = {
    qSearchAll(term, offset = 0, filterArray = null) {
        let idxp = indices.nlmIndexPrefix
        let index = [
            //`${idxp}work`,
            `${idxp}work`,
            `${idxp}person`,
            `${idxp}topic`,
            `${idxp}geography`,
        ]
        let source = [
            '@id',
            'skos:prefLabel',
            'type',
            'work*',
            'has*',
            'place*',
            'person*',
            '_*',
        ]

        /* FILTERS */
        let filter = null
        if (filterArray) {
            filter = parseFilterTerms(filterArray)
        }

        /* AGGREGATIONS */
        let genre = 'workGenre._value.keyword'
        let subject = 'workIsAbout._value.keyword'
        let author = '_creator._value.keyword'

        let aggs = {
            genre: {
                terms: {
                    field: genre,
                    size: 30,
                },
            },
            subject: {
                terms: {
                    field: subject,
                    size: 30,
                },
            },
            author: {
                terms: {
                    field: author,
                    size: 30,
                },
            },
        }

        /* SEARCH */
        let must = [
            {
                multi_match: {
                    query: term,
                    type: 'phrase',
                    fields: [
                        '@id',
                        '_label',
                        '_bdrc_id',
                        '_notes.@value',
                        'workCatalogInfo.@value',
                        'personGender',
                    ],
                },
            },
        ]

        let must_not = {
            exists: {
                field: 'workPartOf',
            },
        }

        //console.log(filter)

        //if you need aggregation you have to use filter
        let query = {
            f: {
                bool: {
                    must: must,
                    must_not: must_not,
                    filter: filter,
                },
            },
            q: {
                bool: {
                    must: must,
                    must_not: must_not,
                },
            },
        }

        const body = {
            from: offset,
            size: resultSetSize,
            aggs: aggs,
            query: filterArray ? query.f : query.q,
            _source: source,
        }

        return client.search({ index, body })
    },
}
