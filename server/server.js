class Server {

    constructor(http) {
        this.io = require('socket.io')(http)
        this.async = require('async')
        this.pool = require('./database.js')
    }

    init() {

        this.io.on('connection', (socket) => {
            console.log('> A client connected')
            this.sendPossibleIngredients(socket.id)
            socket.on('recipesFromIngredsRequest', (msg) => this.sendRecipes(msg))
        })
    }

    sendPossibleIngredients(id) {
        this.pool.query(this.allIngredients(), (err, result) => {
            if (err) throw err
            let ingredients = []
            for (const i of result) {
                ingredients.push(i.ingredient)
            }
            this.io.to(id).emit('possibleIngredientsResult', ingredients)
        })
    }

    sendRecipes(msg) {
        const { id, ingredients } = msg
        this.findRecipes(ingredients, (deets) => {
            this.io.to(id).emit('recipesResult', deets)
        })
    }
    
    findRecipes(ingredients, emitDeets) {
        console.log('---')
        console.log('Searched with: ')
        console.log(ingredients)
    
        let rawRecipeRows = []
        this.async.forEachOf(ingredients, (ingr, i, inner_callback) => {
            this.pool.query(this.mappingQuery(ingr), (err, result) => {
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
        }, (err) => {
            if (!err) {
                let recipesLists = []
                for (let r of rawRecipeRows) {
                    recipesLists.push(r.split(';'))
                }
                console.log(recipesLists)
                if (recipesLists.includes(['NO_RESULT'])) {
                    this.getRecipeDetails([], emitDeets)
                }
                else {
                    this.getRecipeDetails(this.intersectOfLists(recipesLists), emitDeets)
                }
            }
            else {
                console.log('Error finding recipes')
            }
        })
    }
    
    getRecipeDetails(recipes, emitDeets) {
        console.log('Matches:')
        console.log(recipes)
    
        let recipeDetails = []
        this.async.forEachOf(recipes, (name, i, inner_callback) => {
            this.pool.query(this.detailsFromRecipe(name), (err, result) => {
                if (!err && result.length) {
                    const r = result[0]
                    recipeDetails.push({
                        name: r.recipeName,
                        url: r.recipeUrl,
                        image: r.imageUrl,
                        description: r.description
                    })
                    inner_callback(null)
                }
                else {
                    inner_callback(err)
                    console.log('Error during query in recipeUrl table')
                }
            })
        }, (err) => {
            if (!err) {
                emitDeets(recipeDetails)
            }
            else {
                console.log('Error getting recipe details')
            }
        })
    }

    // Queries

    mappingQuery(ingr) {
        return "select recipe from ingredientMapping where ingredient = \"" + ingr + "\""
    }

    detailsFromRecipe(name) {
        return "select * from recipeUrl where recipeName = \"" + name + "\""
    }

    allIngredients() {
        return "select ingredient from ingredientMapping"
    }

    // Utility functions

    intersectOfLists(lists) {
        if (!(lists.length)) return []
        let result = lists[0]
        for (let i = 1; i < lists.length; i++) {
            result = this.intersect(result, lists[i])
        }
        return result
    }

    intersect(a, b) {
        let d = {}
        let result = []
        for (let i = 0; i < b.length; i++) d[b[i]] = true
        for (let i = 0; i < a.length; i++) if (d[a[i]]) result.push(a[i])
        return result
    }
}

module.exports = Server