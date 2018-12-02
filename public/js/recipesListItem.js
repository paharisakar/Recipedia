Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item" v-on:click="$emit('click-recipe', recipe.id)" v-bind:title="recipe.description">
            <a v-bind:href="recipe.url" target="_blank">
                <img v-bind:src="recipe.image" />
                <h3>{{ recipe.name }}</h3>
                <h3>{{ recipe.calories }}</h3>
            </a>
        </div>
    `
})
