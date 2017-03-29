<template>
  <div class="card">
    <div class="card-header" role="tab" :id="headerId">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" :data-parent="parentHref" :href="collapseHref" aria-expanded="true" :aria-controls="collapseId">
          {{ title }}
        </a>
      </h5>
    </div>

    <div :id="collapseId" class="collapse" role="tabpanel" :aria-labelledby="headerId">
      <ul class="list-group list-group-flush">
        <li v-for="(count, itemName) in recipe.input" class="list-group-item justify-content-between">
          {{ itemName }}
          <span class="badge badge-default badge-pill">{{ count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Recipe',
  props: ['recipe', 'section'],
  computed: {
    title() {
      return Object.keys(this.recipe.output)[0];
    },
    headerId() {
      return 'heading_' + Object.keys(this.recipe.output)[0];
    },
    collapseId() {
      return 'collapse_' + Object.keys(this.recipe.output)[0];
    },
    collapseHref() {
      return '#' + this.collapseId;
    },
    parentHref() {
      return '#' + this.section;
    }
  }
};
</script>
