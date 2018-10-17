const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const pool = require('./server/database.js')

// Serve the public folder statically
app.use(express.static(__dirname + '/public'))
http.listen(3000, () => console.log('Listening on port 3000...'))

// Sockets
io.on('connection', (socket) => {
    console.log('a client connected')

    socket.on('query_request', (msg) => findRecipes(msg))
})

// Database queries
function findRecipes(msg) {
    const { id, ingredients } = msg
    console.log(ingredients)

    let recipes = []
    pool.query("select * from recipes", function(err, result) {
        if (err) throw err

        for (const r of result) {
            recipes.push({
                'id': r.id,
                'title': r.title,
                'body': r.body,
                'url': r.url,
            })
        }
        console.log(recipes)

        io.to(id).emit('query_result', recipes)
    })
}