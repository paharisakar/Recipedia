Vue.component('suggestions-list-item', {
    props: ['suggestion'],
    template: `
        <div class="suggestions-list-item" v-on:click="$emit('add-suggestion', suggestion)" title="Click to add ingredient">
            {{ suggestion }}
        </div>
    `,
})