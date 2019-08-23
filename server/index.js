require('dotenv').config()
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
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

// Route Definitions
const health = require('./routes/health')
const search = require('./routes/search')
const searchCatalogs = require('./routes/searchCatalogs')
const searchETexts = require('./routes/searchETexts')
const catalogListing = require('./routes/catalogListing')
const catalog = require('./routes/catalog')
const eTextListing = require('./routes/eTextListing')
const eText = require('./routes/eText')
const searchFullText = require('./routes/fullTextAndSearch')

// Elasticsearch Cluster Health
server.use('/elastic/health', health)

// Search Routes
server.use('/search', search) // SEARCH ALL TYPES /?term=term
server.use('/search/catalogs', searchCatalogs) // SEARCH CATALOG TYPE /?term=term
server.use('/search/text', searchFullText) // GET /:id and search Full-Text ?term=term
server.use('/search/texts', searchETexts) // SEARCH TEXT TYPE /?term=term

// Catalog Routes
server.use('/catalogs', catalogListing) // GET /ALL_CATALOGS
server.use('/catalog', catalog) // GET /:id

// E-Text Routes
server.use('/texts', eTextListing) // GET /ALL_E-TEXTS
server.use('/text', eText) // GET /:id

// Testing with Timestamp
// server.use('*', (request, response, next) => {
//     console.log('Time: %d', Date.now())
//     next()
// })

module.exports = server
