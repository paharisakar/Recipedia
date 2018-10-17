let socket = null

const app = new Vue({
    el: '#app',

    data() {
        return {
            ingr_id_gen: 0,
            ingredients: [],
            show_recipes: false,
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
            socket.emit('query_request', { id: socket.id, ingredients: this.ingredients })
        },
        addIngredient: function() {
            const input = document.getElementById('ingredient-input')

            if (input.value !== '') {
                this.ingr_id_gen++
                this.ingredients.push( { id: this.ingr_id_gen, label: input.value } )
                input.value = ""
                if (!this.show_recipes) {
                    this.show_recipes = true
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
                    this.show_recipes = false
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
        socket.on('query_result', (recipes) => {
            console.log('received query result')
            console.log(recipes)
            this.recipes = recipes
        })
    },
})