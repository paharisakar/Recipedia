Vue.component('ingredient-item', {
    props: ['ingredient'],
    template: `
        <div class="ingredient-item" v-on:click="$emit('delete-ingredient', ingredient.id)">
            {{ ingredient.label }}
        </div>
    `,
})

new Vue({
    el: '#app',
    data() {
        return {
            ingredientsList: [],
            id_gen: 0,
        }
    },
    methods: {
        addIngredient: function() {
            const input = document.getElementById('ingredient-input')

            if (input.value !== '') {
                this.id_gen++
                this.ingredientsList.push( { id: this.id_gen, label: input.value } )
                input.value = ""
            }
        },
        deleteIngredient: function(id) {
            console.log('delete ingredient got called')
            let index = this.ingredientsList.findIndex( function(item) {
                return item.id === id
            })
            if (index !== -1) this.ingredientsList.splice(index, 1)
        }
    }
})