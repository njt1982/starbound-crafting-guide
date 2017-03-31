<template>
  <div>
    <h1><ItemIcon :icon="item.icon" class="big" /> {{ item.title }}</h1>
    <dl  class="row">
      <dt class="col-sm-2">Type</dt>
      <dd class="col-sm-10">{{ item.type }}</dd>

      <dt class="col-sm-2">Price</dt>
      <dd class="col-sm-10">{{ item.price }}</dd>

      <dt class="col-sm-2">Description</dt>
      <dd class="col-sm-10">{{ item.description }}</dd>

      <dt class="col-sm-2">Rarity</dt>
      <dd class="col-sm-10">{{ item.rarity }}</dd>
    </dl>

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
import ItemIcon from './ItemIcon.vue';

export default {
  name: 'ItemDetails',
  data() {
    return {
      allRecipes: require('../recipes.json')
    };
  },
  components: {
    Recipe,
    ItemIcon
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
    },
    iconStyle() {
      return {
        backgroundImage: 'url(' + this.item.icon + ')'
      };
    }
  },
  props: ['item']
};
</script>
