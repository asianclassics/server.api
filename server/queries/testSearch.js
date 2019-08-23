const { client, type, indices } = require('../connection')

async function testSearch() {
    const title = `BYANG GTER THUGS RJE CHEN PO 'GRO BA KUN GROL`
    const index = indices.catalog
    const result = await client.search({
        index,
        type,
        body: {
            query: {
                match_phrase: {
                    ttltib: title,
                },
            },
        },
    })

    console.log('testSearch', result)
}

testSearch()
