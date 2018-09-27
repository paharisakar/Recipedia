Vue.component('ingredients-list-item', {
    props: ['ingredient'],
    template: `
        <div class="ingredients-list-item" v-on:click="$emit('delete-ingredient', ingredient.id)">
            {{ ingredient.label }}
        </div>
    `,
})

Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item">
            <a v-bind:href="'' + recipe.url" target="_blank"><h2> {{ recipe.title }} </h2></a>
            {{ recipe.body }}
        </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            ingr_id_gen: 0,
            ingredients: [],
            recipes: [
                {
                    id: 1,
                    title: "Chana Masala",
                    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip...",
                    url: "https://minimalistbaker.com/easy-chana-masala/",
                },
                {
                    id: 2,
                    title: "Chicken Noodle Soup",
                    body: "Diam vulputate ut pharetra sit amet aliquam id diam. Tempor commodo ullamcorper a lacus. Fermentum posuere urna nec tincidunt. Massa id neque aliquam vestibulum. Elementum facilisis leo vel fringilla est...",
                    url: "https://www.tasteofhome.com/recipes/the-ultimate-chicken-noodle-soup/",
                },
                {
                    id: 3,
                    title: "Authentic Pho",
                    body: "Facilisis mauris sit amet massa. Eget nunc scelerisque viverra mauris in. Malesuada nunc vel risus commodo viverra. Volutpat blandit aliquam etiam erat velit scelerisque in. Cras pulvinar mattis nunc...",
                    url: "https://www.allrecipes.com/recipe/228443/authentic-pho/",
                }
            ],
            show_recipes: false
        }
    },
    methods: {
        addIngredient: function() {
            const input = document.getElementById('ingredient-input')

            if (input.value !== '') {
                this.ingr_id_gen++
                this.ingredients.push( { id: this.ingr_id_gen, label: input.value } )
                input.value = ""
                if (!this.show_recipes) {
                    this.show_recipes = true
                }
            }

        },
        deleteIngredient: function(id) {
            let index = this.ingredients.findIndex( function(item) {
                return item.id == id
            })
            if (index != -1) {
                this.ingredients.splice(index, 1)
                if (this.recipes.length == 0) {
                    this.show_recipes = false
                }
            }
        }
    }
})