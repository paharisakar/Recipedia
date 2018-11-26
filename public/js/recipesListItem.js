Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item" v-on:click="$emit('click-recipe', recipe.id)" title="Click to expand/shrink this recipe.">
            <a v-bind:href="recipe.url" target="_blank">
                <h2>{{ recipe.title }}</h2>
                <h3>{{ recipe.url }}</h3>
                <div class="recipes-list-item-thumbnail">
                    <img v-bind:src="recipe.image" />
                </div>
                <div class="recipes-list-item-description">
                    <p>{{ recipe.description }}</p>
                </div>
            </a>
        </div>
    `
})