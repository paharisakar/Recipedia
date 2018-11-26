Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item" v-on:click="$emit('click-recipe', recipe.id)" title="Click to expand/shrink this recipe.">
            <a v-bind:href="recipe.url" target="_blank">
                <img v-bind:src="recipe.img" />
                <h3>{{ recipe.title }}</h3>
            </a>
        </div>
    `
})