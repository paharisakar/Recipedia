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
            filterOption: "1",
            inputType: "ingredients",
        }
    },
    
    methods: {
     /* toggleInputType is directly involved with changing between recipes and ingredients
        inputBar is the object for the label
        submitButton is the object for the button
        the toggle labels get handled in the css file */
        toggleInputType: function() {
            this.inputType == "ingredients" ? this.inputType = "recipes" : this.inputType = "ingredients"
            
            const inputBar = document.getElementById('input-bar')
            const submitButton = document.getElementById('submit-button')

            inputBar.value = ""
            this.recipes = []
            this.showRecipes = false

            if (this.inputType == "ingredients") {
                inputBar.placeholder = "Enter your ingredients"
                submitButton.innerHTML = "Add"
            }
            else {
                inputBar.placeholder = "Search for recipes"
                submitButton.innerHTML = "Search"
                this.ingredients = []
                this.suggestions = []
            }
        },

        sortByFilter: function() {
            switch(this.filterOption) {
                case "1":
                this.recipes.sort( (a, b) => {
                    return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1
                })
                break
                case "2":
                this.recipes.sort( (a, b) => {
                    return (a.name.toUpperCase() < b.name.toUpperCase()) ? 1 : -1
                })
                break
                case "3":
                this.recipes.sort( (a, b) => {
                    return (parseInt(a.calories) < parseInt(b.calories)) ? 1 : -1
                })
                break
                case "4":
                this.recipes.sort( (a, b) => {
                    return (parseInt(a.calories) > parseInt(b.calories)) ? 1 : -1
                })
                break
            }
        },
        
        submitInput: function() {
            switch(this.inputType) {
                case "ingredients":
                    this.addIngredient()
                    break
                case "recipes":
                    this.searchByPhrase()
                    break
            }
        },
        
        searchByPhrase: function() {
            const input = document.getElementById('input-bar')
            const phrase = input.value
            
            if (phrase !== '') {
                this.showRecipes = true
                socket.emit('recipesFromPhraseRequest', { id: socket.id, phrase: phrase })
            }
            else {
                this.recipes = []
                this.showRecipes = false
            }
        },
        
        addIngredient: function() {
            const input = document.getElementById('input-bar')
            if (input.value !== '') {
                input.value = ""
                if (this.suggestions.length) {
                    const ingr = this.suggestions[0]
                    this.suggestions = []
                    
                    let found = false
                    for (let i = 0; i < this.ingredients.length; i++) {
                        if (this.ingredients[i].label == ingr) {
                            found = true
                            break
                        }
                    }
                    
                    if (!found) {
                        this.ingr_id_gen++
                        this.ingredients.push( { id: this.ingr_id_gen, label: ingr } )
                        
                        this.showRecipes = true
                        socket.emit('recipesFromIngredientsRequest', { id: socket.id, ingredients: this.ingredients.map(el => el.label) })
                    }
                }
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
                    this.showRecipes = true
                    socket.emit('recipesFromIngredientsRequest', { id: socket.id, ingredients: this.ingredients.map(el => el.label) })
                }
            }
        },
        
        addSuggestion: function(suggestion) {
            this.suggestions = []
            const input = document.getElementById('input-bar')
            input.value = ""
            
            this.ingr_id_gen++
            this.ingredients.push( { id: this.ingr_id_gen, label: suggestion } )
            
            this.showRecipes = true
            socket.emit('recipesFromIngredientsRequest', { id: socket.id, ingredients: this.ingredients.map(el => el.label) })
        },
        
        inputUpdate: function() {
            if (this.inputType == "ingredients") {
                console.log('awye')
                const input = document.getElementById('input-bar')
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
            }
        },
    },
    created: function() {
        socket = io()
    },
    
    mounted: function() {
        socket.on('recipesResult', (data) => {
            this.recipes = data.map( r => {
                this.reci_id_gen++
                return {
                    id: this.reci_id_gen,
                    name: r.name,
                    url: r.url,
                    image: r.image,
                    description: r.description,
                    calories: r.calories,
                }
            })
            this.sortByFilter()
        })

        socket.on('possibleIngredientsResult', (allIngredients) => {
            this.possibleIngredients = allIngredients
        })
    },
})