Vue.component('recipes-list-item', {
    props: ['recipe'],
    template: `
        <div class="recipes-list-item">
            <a v-bind:href="'' + recipe.url" target="_blank"><h2> {{ recipe.title }} </h2></a>
            <p v-html="recipe.snippet"></p>
        </div>
    `
})