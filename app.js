const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const async = require('async')
const pool = require('./server/database.js')

// Serve the public folder statically
app.use(express.static(__dirname + '/public'))
http.listen(3000, () => console.log('Listening on port 3000...'))

// Sockets
io.on('connection', (socket) => {
    console.log('> A client connected')
    sendPossibleIngredients(socket.id)
    socket.on('recipesRequest', (msg) => sendRecipes(msg))
})

// Serving database queries
function sendPossibleIngredients(id) {
    pool.query("select ingredient from ingredientMapping", function(err, result) {
        if (err) throw err
        let ingredients = []
        for (const i of result) {
            ingredients.push(i.ingredient)
        }
        io.to(id).emit('allIngredientsResult', ingredients)
    })
}

function sendRecipes(msg) {
    const { id, ingredients } = msg

    findRecipes(ingredients, getRecipeDetails, function(deets) {
        io.to(id).emit('recipesResult', deets)
    })
}

function findRecipes(ingredients, getDeets, emitDeets) {
    console.log('---')
    console.log('Searched with: ')
    console.log(ingredients)

    let rawRecipeRows = []
    async.forEachOf(ingredients, function(ingr, i, inner_callback) {
        const q = "select recipe from ingredientMapping where ingredient = \"" + ingr + "\""
        pool.query(q, function(err, result) {
            if (!err && result.length) {
                rawRecipeRows.push(result[0].recipe)
                inner_callback(null)
            }
            else {
                console.log('Error during query in ingredientMapping table')
                rawRecipeRows.push('NO_RESULT')
                inner_callback(err)
            }
        })
    }, function (err) {
        if (!err) {
            let recipesLists = []
            for (r of rawRecipeRows) {
                recipesLists.push(r.split(';'))
            }
            console.log(recipesLists)
            if (recipesLists.includes(['NO_RESULT'])) {
                getDeets([], emitDeets)
            }
            else {
                getDeets(intersectOfLists(recipesLists), emitDeets)
            }
        }
        else {
            console.log('Error finding recipes')
        }
    })
}

function getRecipeDetails(recipes, emitDeets) {
    console.log('Matches:')
    console.log(recipes)

    let recipeDetails = []
    async.forEachOf(recipes, function(name, i, inner_callback) {
        const q = "select instructions from instruction where Dish = \"" + name + "\""
        pool.query(q, function(err, result) {
            if (!err && result.length) {
                recipeDetails.push({ dish: name, details: result[0].instructions })
                inner_callback(null)
            }
            else {
                inner_callback(err)
                console.log('Error during query in instruction table')
            }
        })
    }, function (err) {
        if (!err) {
            emitDeets(recipeDetails)
        }
        else {
            console.log('Error getting recipe details')
        }
    })
}

function intersectOfLists(lists) {
    if (!(lists.length)) return []
    let result = lists[0]
    for (let i = 1; i < lists.length; i++) {
        result = intersect(result, lists[i])
    }
    return result
}
function intersect(a, b) {
    let d = {}
    let result = []
    for (let i = 0; i < b.length; i++) d[b[i]] = true
    for (let i = 0; i < a.length; i++) if (d[a[i]]) result.push(a[i])
    return result
}