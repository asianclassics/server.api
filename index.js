require('dotenv').config()
const server = require('./server')
const port = process.env.PORT || 5000

server
    .listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
    .on('error', (error) => {
        console.log(
            error,
            'Logging error to console. This is a nodemon error that recently started when I accidentally used yarn'
        )
    })
