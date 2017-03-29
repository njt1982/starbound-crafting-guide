<template>
  <div>
    <h1>{{ item.title }}</h1>
    <div class="row">
      <Recipe v-for="(recipe, key) in resolvedRecipes" :recipe="recipe" :key="key"></Recipe>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Recipe from './Recipe.vue';

export default {
  name: 'ItemDetails',
  data() {
    return {
      allRecipes: null
    };
  },
  created() {
    this.updateRecipes();
  },
  components: {
    Recipe
  },
  methods: {
    updateRecipes() {
      this.resolvedRecipes = [];
      this.resolvedMakes = [];

      $.get('/recipes.json', data => {
        this.allRecipes = data;
      });
    }
  },
  computed: {
    resolvedRecipes() {
      if (this.allRecipes !== null) {
        return this.item.recipes.map(key => {
          return this.allRecipes[key];
        });
      }
    }
  },
  props: ['item']
};
</script>
