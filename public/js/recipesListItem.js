Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item" v-on:click="$emit('click-recipe', recipe.id)" v-bind:title="recipe.description">
            <a v-bind:href="recipe.url" target="_blank">
                <img v-bind:src="recipe.image" />
                <h3>{{ recipe.name }}</h3>
                <p v-if="recipe.calories">
                    {{ recipe.calories }} calories per serving
                </p>
                <p v-else>
                    n/a
                </p>
            </a>
        </div>
    `
})
