const {
    filterObjectByKeysAndRemoveNulls,
} = require('../parsers/filterObjectByKeys')

module.exports = {
    /*     
    ACIP Citations
    SUNGBUM
    mKhas-grub rje dGe-legs dpal bzang-po (1385-1438).  
    The "Illumination of the Difficult," being an Explanation of the Commentary Known as the 
    "Meaning Clarified” ('Grel-pa don-gsal gyi rnam-bshad rTogs-dka'i snang-ba, ACIP S05461), 223 ff.

    Author name (author dates).  Title (Tibetan Title, ACIP number), pages


    KANGYUR
    Śākyamuni Buddha (Tib: Sh’akya thub-pa), 500bc. The Perfection of Wisdom in 100,000 
    Lines (Śatasahasrika Prajñā Pāramitā) (Tib: Shes-rab kyi pha-rol tu phyin-pa sTong-phrag brgya-pa, 
    Tibetan translation at ACIP KL00008, in 12 parts: Vols. 1–12 [Ka-Na] in the “Perfection of Wisdom in 
    100,000 Lines” Section [Śatasahasrika, ‘Bum] of the bKa’-‘gyur [lHa-sa edition]).


    Author name Sanskrit (Author name Tibetan), (author dates).  
    Title (Sanskrit title) (Tibetan Title, ACIP number Vol # [Vol # Tibetan] location in collection) collection [edition]).



    TENGYUR
    Maudgalyayāna (Tib: Mo'u dgal gyi bu), c. 500bc.  A Presentation of the World (Loka Prajñapti) 
    (Tib: 'Jig-rten gzhag-pa, Tibetan translation at ACIP TD04086, ff. 1b–93a of Vol. 1 [Ai] in the Higher 
    Knowledge Section [Abhidharma, mNgon-pa] of the bsTan-‘gyur [sDe-dge edition]). 


    Author name Sanskrit (Author name Tibetan), (author dates).  Title (Sanskrit title) 
    (Tibetan Title, ACIP number Vol # [Vol # Tibetan] location in collection) collection [edition]). 
    
*/

    postProcessCitation(body, paramsID) {
        // In case we get all related records, citation is only for main ID
        let record = body.hits.hits.find((h) => h._id == paramsID)

        // assuming we find the record, let's process it
        if (record) {
            // now filter down to citation fields
            // send all data fields back and front end can format based on collection type
            let { _source } = record

            // METADATA -----------------------------------
            const collection = _source['bibframe:collection']
            const catref = _source['all:catref']
            const catalogNumber = _source['all:catalognumber']
            // Folio number range?

            // AUTHOR ------------------------------------
            let author = _source['bibframe:person']
                ? { 'bibframe:name': _source['bibframe:person'] }
                : { 'bibframe:name': 'UNKNOWN' }
            if (_source['bibframe:role@author']) {
                author = filterObjectByKeysAndRemoveNulls(
                    _source['bibframe:role@author'][0],
                    ['name', 'dates']
                )
            }

            // TITLES ------------------------------------
            const titles = filterObjectByKeysAndRemoveNulls(_source, ['title'])

            // UNKNOWNS -------------------------------------
            // UNKNOWNS, vol #, location in collection, collection edition

            record.citation = {
                collection,
                catref,
                catalogNumber,
                author,
                titles,
            }
        }

        return record
    },
}
