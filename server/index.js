const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

// Another way to do this is to create own server
// var http = require('http');
// var app = express();
// var server = http.createServer(app);
// then you can catch errors as needed
// server.on('error', function (e) {
//     // do your thing
//   });
// and listen
//server.listen(3000);

// Initialize...
const server = express()

server.use(cors())
server.use('/stripe', express.raw({ type: 'application/json' }))
server.use(express.json())
server.use(
    express.urlencoded({
        extended: true,
    })
)
// Route Definitions --------------------------
// Health -------------------------------------
const health = require('./controllers/health')

// ACE routes ---------------------------------
const collections = require('./controllers/ace/collections')
const search = require('./controllers/ace/search')
const searchCatalogs = require('./controllers/ace/searchCatalogs')
const searchETexts = require('./controllers/ace/searchETexts')
const catalogListing = require('./controllers/ace/catalogListing')
const catalog = require('./controllers/ace/catalog')
const eTextListing = require('./controllers/ace/eTextListing')
const eText = require('./controllers/ace/eText')
const searchFullText = require('./controllers/ace/fullTextAndSearch')

// DIGITAL LIBRARY ROUTES ----------------------
const getResourceListing = require('./controllers/library/rGetResourceListing')
const getResource = require('./controllers/library/rGetResource')
const getResourceDownload = require('./controllers/library/rGetResourceDownload')

// STRIPE
const receiveStripeHook = require('./controllers/stripe/routeStripeWebhook')

// Test Routes ---------------------------------
const searchETextsTesting = require('./controllers/ace/searchETextsTesting')
const testSearch = require('./controllers/tests/rSearchTest')

// NLM Routes ----------------------------------
const nlmFetchID = require('./controllers/nlm/rFetchID')
const nlmFetchAll = require('./controllers/nlm/rFetchAll')
const nlmFetchWorks = require('./controllers/nlm/rFetchWorks')
const nlmFetchAuthors = require('./controllers/nlm/rFetchAuthors')
const nlmFetchSubjects = require('./controllers/nlm/rFetchSubjects')
const nlmFetchPlaces = require('./controllers/nlm/rFetchPlaces')
const nlmSearchByIDNoCode = require('./controllers/nlm/rSearchByID_noCode')
const nlmSearchAll = require('./controllers/nlm/rSearchAll')

// Elasticsearch Cluster Health
server.use('/elastic/health', health)

// Collections
server.use('/collections', collections)

// Search Routes
server.use('/search', search) // SEARCH ALL TYPES /?term=term
server.use('/search/catalogs', searchCatalogs) // SEARCH CATALOG TYPE /?term=term
server.use('/search/text', searchFullText) // GET /:id and search Full-Text ?term=term
server.use('/search/texts', searchETexts) // SEARCH TEXT TYPE /?term=term

// DIGITAL LIBRARY
server.use('/resources', getResource)
server.use('/resources', getResourceListing)
server.use('/resources', getResourceDownload)

// STRIPE
server.use('/stripe', receiveStripeHook)

// Catalog Routes
server.use('/catalogs', catalogListing) // GET /ALL_CATALOGS
server.use('/catalog', catalog) // GET /:id

// E-Text Routes
server.use('/texts', eTextListing) // GET /ALL_E-TEXTS
server.use('/text', eText) // GET /:id

// Test Routes
server.use('/test/search/texts', searchETextsTesting)
server.use('/test/search', testSearch)

// NLM Routes
//server.use('/nlm/search/ids', nlmSearchByID)
server.use('/nlm/search/ids/nocode', nlmSearchByIDNoCode)
server.use('/nlm/_all', nlmFetchAll)
server.use('/nlm/_works', nlmFetchWorks)
server.use('/nlm/_authors', nlmFetchAuthors)
server.use('/nlm/_subjects', nlmFetchSubjects)
server.use('/nlm/_places', nlmFetchPlaces)
server.use('/nlm/_ids', nlmFetchID)
server.use('/nlm/search/_all', nlmSearchAll)

// Testing with Timestamp
// server.use('*', (request, response, next) => {
//     console.log('Time: %d', Date.now())
//     next()
// })

module.exports = server
