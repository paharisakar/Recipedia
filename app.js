const express = require('express')
const app = express()
const http = require('http').Server(app)
const Server = require('./server/server.js')

// Serve the public folder statically
app.use(express.static(__dirname + '/public'))
http.listen(3000, () => console.log('Listening on port 3000...'))

// Launch server instance
let server = new Server(http)
server.init()