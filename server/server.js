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
            socket.on('recipesRequest', (msg) => this.sendRecipes(msg))
        })
    }

    sendPossibleIngredients(id) {
        this.pool.query("select ingredient from ingredientMapping", (err, result) => {
            if (err) throw err
            let ingredients = []
            for (const i of result) {
                ingredients.push(i.ingredient)
            }
            this.io.to(id).emit('allIngredientsResult', ingredients)
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
            this.pool.query(this.instructionsQuery(name), (err, result) => {
                if (!err && result.length) {
                    recipeDetails.push({ dish: name, details: result[0].instructions })
                    inner_callback(null)
                }
                else {
                    inner_callback(err)
                    console.log('Error during query in instruction table')
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
    
    mappingQuery(ingr) {
        return "select recipe from ingredientMapping where ingredient = \"" + ingr + "\""
    }

    instructionsQuery(name) {
        return "select instructions from instruction where Dish = \"" + name + "\""
    }

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