let socket = null

const app = new Vue({
    el: '#app',

    data() {
        return {
            ingr_id_gen: 0,
            ingredients: [],
            possibleIngredients: [],
            showRecipes: false,
            recipes: [
                {
                    id: 1,
                    title: "Chana Masala",
                    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip...",
                    url: "https://minimalistbaker.com/easy-chana-masala/",
                },
            ],
        }
    },

    methods: {
        fetchRecipes: function() {
            socket.emit('recipesRequest', { id: socket.id, ingredients: this.ingredients })
        },
        //fetchPossibleIngredients: function() {
        //    socket.emit('allIngredientsRequest', { id: socket.id })
        //}, 
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
        console.log('gets called')
        
    },

    mounted: function() {
        socket.on('recipesResult', (recipes) => {
            console.log('received recipes result')
            console.log(recipes)
            this.recipes = recipes
        })
        socket.on('allIngredientsResult', (allIngredients) => {
            console.log(allIngredients)
            this.possibleIngredients = allIngredients  
        })
    },
})