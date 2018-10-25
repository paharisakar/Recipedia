Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item" v-on:click="$emit('click-recipe', recipe.id)" title="Click to expand/shrink this recipe.">
            <h3> {{ recipe.title }} </h3>
            <div v-if="recipe.showFull">
                <p v-html="recipe.body"></p>
            </div>
            <div v-else>
                <p v-html="recipe.snippet"></p>
            </div>
        </div>
    `
})