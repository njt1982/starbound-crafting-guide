<template>
  <div>
    <h1>{{ item.title }}</h1>

    <div class="mt-4" v-show="resolvedMakes.length">
      <h3>Made with...</h3>
      <div id="made_with" role="tablist" aria-multiselectable="true">
        <Recipe v-for="(recipe, key) in resolvedMakes" :recipe="recipe" :key="key" section="made_with"></Recipe>
      </div>
    </div>

    <div class="mt-4" v-show="resolvedRecipes.length">
      <h3>Used to make {{ resolvedRecipes.length }} items</h3>
      <div id="used_to_make" role="tablist" aria-multiselectable="true">
        <Recipe v-for="(recipe, key) in resolvedRecipes" :recipe="recipe" :key="key" section="used_to_make"></Recipe>
      </div>
    </div>
  </div>
</template>

<script>
import Recipe from './Recipe.vue';

export default {
  name: 'ItemDetails',
  data() {
    return {
      allRecipes: require('../recipes.json')
    };
  },
  components: {
    Recipe
  },
  computed: {
    resolvedRecipes() {
      if (this.allRecipes !== null) {
        return this.item.recipes.map(key => {
          return this.allRecipes[key];
        });
      }
    },
    resolvedMakes() {
      if (this.allRecipes !== null) {
        return this.item.makes.map(key => {
          return this.allRecipes[key];
        });
      }
    }
  },
  props: ['item']
};
</script>
