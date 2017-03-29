<template>
<div class="col-sm-4 mb-4">
  <div class="card">
    <div class="card-block">
      <h4 class="card-title">{{ Object.keys(recipe.output)[0] }}</h4>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Recipe',
  props: ['recipe']
};
</script>
