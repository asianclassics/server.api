module.exports = {
    postProcessCitation(body, paramsID) {
        let record = body.hits.hits.find(h => h._id == paramsID)
        if(record) {
            // now process it to a citation
            // need to find out what a citation looks like from nick/ben
            // jc might have good ideas about different styles to include
            const author = record._source['bibframe:person']
            const title = record._source['bibframe:maintitle']

            record.citation = {
                author, title
            }
        }
        return record
    }
}