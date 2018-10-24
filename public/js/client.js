let socket = null

const app = new Vue({
    el: '#app',

    data() {
        return {
            possibleIngredients: [],
            ingr_id_gen: 0,
            showRecipes: false,
            suggestions: [],
            ingredients: [],
            recipes: [],
            recipesTitle: "We found some recipes for you... ",
        }
    },
    
    methods: {
        fetchRecipes: function() {
            socket.emit('recipesRequest', { id: socket.id, ingredients: this.ingredients.map(el => el.label) })
        },

        ingredientInputUpdate: function() {
            const input = document.getElementById('ingredient-input')
            if (input.value.length > 1 ) {
                let results = fuzzy.filter(input.value, this.possibleIngredients)
                if (results.length > 5) {
                    results = results.slice(0, 5)
                }
                this.suggestions = results.map(el => el.string)
            }
            else {
                this.suggestions = []
            }
        },

        addSuggestion: function(suggestion) {
            this.suggestions = []
            const input = document.getElementById('ingredient-input')
            this.ingr_id_gen++
            this.ingredients.push( { id: this.ingr_id_gen, label: suggestion } )
            input.value = ""
            if (!this.showRecipes) {
                this.showRecipes = true
            }
            this.fetchRecipes()
        },

        addIngredient: function() {
            const input = document.getElementById('ingredient-input')
            if (input.value !== '') {
                this.ingr_id_gen++
                this.ingredients.push( { id: this.ingr_id_gen, label: input.value } )
                input.value = ""
                if (!this.showRecipes) {
                    this.showRecipes = true
                }
                this.fetchRecipes()
            }
        },

        deleteIngredient: function(id) {
            let index = this.ingredients.findIndex( function(item) {
                return item.id == id
            })
            if (index != -1) {
                this.ingredients.splice(index, 1)
                if (this.ingredients.length == 0) {
                    this.showRecipes = false
                }
                else {
                    this.fetchRecipes()
                }
            }
        },
    },

    created: function() {
        socket = io()   
    },

    mounted: function() {
        socket.on('recipesResult', (data) => {
            this.recipes = data.map( recipe => {
                const look_after = 50
                const snippet_end = recipe.details.substr(look_after).indexOf('<br>') + look_after
                return {
                    title: recipe.dish, 
                    body: recipe.details,
                    snippet: recipe.details.slice(0, snippet_end) + '..',
                    url: "#"
                }
            })
        })
        socket.on('allIngredientsResult', (allIngredients) => {
            this.possibleIngredients = allIngredients
        })
    },
})