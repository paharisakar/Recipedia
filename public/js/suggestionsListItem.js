Vue.component('suggestions-list-item', {
    props: ['suggestion'],
    template: `
        <div class="suggestions-list-item" v-on:click="$emit('add-suggestion', suggestion)">
            {{ suggestion }}
        </div>
    `,
})