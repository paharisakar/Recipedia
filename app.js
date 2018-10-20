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
    sendPossibleIngredients(socket.id)
    socket.on('recipesRequest', (msg) => sendRecipes(msg))
})

// Serving database queries
function sendPossibleIngredients(id) {
    pool.query("select ingredient from ingredientMapping", function(err, result) {
        if (err) throw err
        let ingredients = []
        for (const i of result) ingredients.push(i.ingredient)
        io.to(id).emit('allIngredientsResult', ingredients)
    })
}

function sendRecipes(msg) {
    const { id, ingredients } = msg


    pool.query("select * from recipes", function(err, result) {
        if (err) throw err
        let recipes = []
        for (const r of result) {
            recipes.push({
                'id': r.id,
                'title': r.title,
                'body': r.body,
                'url': r.url,
            })
        }

        io.to(id).emit('recipesResult', recipes)
    })
}

// Query helpers
function getRecipesFromIngredient(ingredient) {
    pool.query("select * from ingredientMapping where ingredient = ${ingredient}", function(err, result) {
        if(err) throw err
        return 
    })
}