Vue.component('ingredients-list-item', {
    props: ['ingredient'],
    template: `
        <div class="ingredients-list-item" v-on:click="$emit('delete-ingredient', ingredient.id)" title="Click to remove ingredient">
            {{ ingredient.label }}
        </div>
    `,
})