const app = new Vue({
    el: '#app',
    data() {
        return {
            ingredientsList: []
        }
    },
    methods: {
        addIngredient: function() {
            const input = document.getElementById('inputForm')

            if (input.value !== '') {
                this.ingredientsList.push(input.value)
                input.value = ""
            }
        }
    }
})