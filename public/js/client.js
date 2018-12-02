let socket = null

const app = new Vue({
    el: '#app',

    data() {
        return {
            showRecipes: false,
            ingr_id_gen: 0,
            reci_id_gen: 0,
            suggestions: [],
            ingredients: [],
            recipes: [],
            possibleIngredients: [],
            filterOption: "",
        }
    },

    methods: {
        clickRecipe: function(id) {
            let r = this.recipes.find(obj => obj.id == id)
            //r.showFull = !r.showFull
        },

        changedFilter: function() {
            if (this.filterOption == "Recipe: A to Z") {1
                //code to sort the recipes A to Z
            }
            else if (this.filterOption == "Recipe: Z to A") {
                //code to sort the recipes A to Z
            }
            else if (this.filterOption == "Calorie: High to Low") {
                //code to sort the Calorie: High to Low
                this.recipes.reverse()
            }
            else if (this.filterOption == "Calorie: Low to High") {
                //code to sort the Calorie: Low to High
                this.recipes.reverse()
            }

        },

        ingredientInputUpdate: function() {
            const input = document.getElementById('ingredient-input')
            if (input.value.length > 0 ) {
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

        fetchRecipes: function() {
            socket.emit('recipesFromIngredsRequest', { id: socket.id, ingredients: this.ingredients.map(el => el.label) })
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
                this.reci_id_gen++
                return {
                    id: this.reci_id_gen,
                    title: recipe.name,
                    url: recipe.url,
                    image: recipe.image,
                    description: recipe.description
                }
            })
        })

        socket.on('possibleIngredientsResult', (allIngredients) => {
            this.possibleIngredients = allIngredients
        })
    },
})
