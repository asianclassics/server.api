const { client } = require('../../connection')

// id: string,
// index: string,
// type: string,
// wait_for_active_shards: string,
// op_type: 'index' | 'create',
// refresh: 'true' | 'false' | 'wait_for',
// routing: string,
// timeout: string,
// version: number,
// version_type: 'internal' | 'external' | 'external_gte',
// if_seq_no: number,
// if_primary_term: number,
// pipeline: string,
// require_alias: boolean,
// body: object

module.exports = {
    putStripeRecord(data, index) {
        let id = data.id
        const body = data
        return client.index({ id, index, body })
    },
}
