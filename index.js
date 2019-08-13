const server = require('./server/server')
const port = process.env.PORT || 5000

// const EventEmitter = require('events').EventEmitter
// const events = new EventEmitter()
// events.on('error', () => {
//     console.log('i found an error')
// })
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
// .on('error', error => {
//     console.log(
//         error,
//         'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
//     )
// })
