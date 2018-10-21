let socket = null

const app = new Vue({
    el: '#app',

    data() {
        return {
            possibleIngredients: [],
            ingr_id_gen: 0,
            showRecipes: false,
            ingredients: [],
            recipes: [],
        }
    },
    methods: {
        fetchRecipes: function() {
            socket.emit('recipesRequest', { id: socket.id, ingredients: this.ingredients })
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
                return {
                    title: recipe.dish, 
                    body: recipe.details,
                    url: "#"
                }
            })
        })
        socket.on('allIngredientsResult', (allIngredients) => {
            this.possibleIngredients = allIngredients  
        })
    },
})