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
            socket.on('recipesFromIngredientsRequest', (msg) => this.sendRecipesFromIngredients(msg))
            socket.on('recipesFromPhraseRequest', (msg) => this.sendRecipesFromPhrase(msg))
        })
    }

    sendPossibleIngredients(id) {
        this.pool.query(this.queryAllIngredients(), (err, result) => {
            if (err) throw err
            let ingredients = []
            for (const i of result) {
                ingredients.push(i.ingredient)
            }
            this.io.to(id).emit('possibleIngredientsResult', ingredients)
        })
    }

    sendRecipesFromIngredients(msg) {
        const { id, ingredients } = msg
        console.log("")
        console.log("=> ingredient search by " + id)
        this.findRecipesFromIngredients(ingredients, (recipeData) => {
            console.log('Emitting ' + recipeData.length + ' recipes')
            this.io.to(id).emit('recipesResult', recipeData)
        })
    }
    
    sendRecipesFromPhrase(msg) {
        const { id, phrase } = msg
        console.log("")
        console.log("=> recipe search by " + id)
        this.findRecipesFromPhrase(phrase, (recipeData) => {
            console.log('Emitting ' + recipeData.length + ' recipes')
            this.io.to(id).emit('recipesResult', recipeData)
        })
    }

    findRecipesFromPhrase(phrase, emitRecipeData) {
        console.log('Searched with phrase: ' + phrase)

        this.pool.query(this.queryRecipesLikePhrase(phrase), (err, result) => {
            if (!err) {
                let recipeDetails = []
                if (result.length) {
                    for (let r of result) {
                        recipeDetails.push({
                            name: r.recipeName,
                            url: r.recipeUrl,
                            image: r.imageUrl,
                            description: r.description,
                            calories: r.calories,
                        })
                    }
                }
                else {
                    console.log("No recipes with phrase '" + phrase + "' found")
                }

                emitRecipeData(recipeDetails)
            }
            else {
                console.log('Error during query in recipeUrl table')
            }
        })

    }
    
    findRecipesFromIngredients(ingredients, emitRecipeData) {
        console.log('Searched with ingredients: ')
        console.log(ingredients)
    
        let rawRecipeRows = []
        this.async.forEachOf(ingredients, (ingr, i, inner_callback) => {
            this.pool.query(this.queryRecipesFromIngredient(ingr), (err, result) => {
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

                if (recipesLists.includes(['NO_RESULT'])) {
                    this.getRecipeDetails([], emitRecipeData)
                }
                else {
                    this.getRecipeDetails(this.intersectOfLists(recipesLists), emitRecipeData)
                }
            }
            else {
                console.log('Error finding recipes')
            }
        })
    }
    
    getRecipeDetails(recipes, emitRecipeData) {
        console.log('Matches:')
        console.log(recipes)
    
        let recipeDetails = []
        this.async.forEachOf(recipes, (name, i, inner_callback) => {
            this.pool.query(this.queryDetailsFromRecipe(name), (err, result) => {
                if (!err && result.length) {
                    const r = result[0]
                    recipeDetails.push({
                        name: r.recipeName,
                        url: r.recipeUrl,
                        image: r.imageUrl,
                        description: r.description,
                        calories: r.calories,
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
                emitRecipeData(recipeDetails)
            }
            else {
                console.log('Error getting recipe details')
            }
        })
    }

    // Queries

    queryRecipesFromIngredient(ingr) {
        return "select recipe from ingredientMapping where ingredient = \"" + ingr + "\""
    }

    queryDetailsFromRecipe(name) {
        return "select * from recipeUrl where recipeName = \"" + name + "\""
    }

    queryAllIngredients() {
        return "select ingredient from ingredientMapping"
    }

    queryRecipesLikePhrase(phrase) {
        return "select * from recipeUrl where recipeName like '%" + phrase + "%'"
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