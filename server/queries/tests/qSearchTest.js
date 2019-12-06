const { client, resultSetSize } = require('../../connection')

module.exports = {
    searchTest() {
        const searchObjects = {
            b: {
                index: 'v1_bdrc_work',
                fields: ['skos:prefLabel.@value'],
                term: 'bslang',
                ids: ['bdr:W1NLM16'],
            },
            e: {
                index: 'acip_etexts',
                fields: [
                    'titletib^3',
                    'titleeng^3',
                    'titleskt^3',
                    'tibtext',
                    'authortib^5',
                    'authorskt^5',
                    'authoreng^5',
                    'collection',
                    'catalognumber',
                ],
                term: 'bslang',
                ids: ['96525'],
            },
        }

        let c = searchObjects.b

        let index = c.index

        let query = {
            mm: {
                multi_match: {
                    query: c.term,
                    type: 'phrase',
                    fields: c.fields,
                },
            },
            ids: {
                ids: {
                    values: c.ids,
                },
            },
        }

        const body = {
            from: 0,
            size: resultSetSize,
            query: query.ids,
        }

        return client.search({ index, body })

        //console.log(body)
        //return client.search({ index, type, body })
    },
}
