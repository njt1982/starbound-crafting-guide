<template>
  <div class="card">
    <div class="card-header" role="tab" :id="headerId">
      <h5 class="mb-0">
        <ItemIcon :icon="outputItem.icon" />
        <a class="collapsed" data-toggle="collapse" :data-parent="parentHref" :href="collapseHref" aria-expanded="true" :aria-controls="collapseId">
          {{ title }}
        </a>
      </h5>
    </div>

    <div :id="collapseId" class="collapse" role="tabpanel" :aria-labelledby="headerId">
      <ul class="list-group list-group-flush">
        <li v-for="(count, itemName) in recipe.input" class="list-group-item justify-content-between">
          <span>
            <ItemIcon :icon="getItemByName(itemName).icon" />
            <router-link :to="{name: 'itemPage', params: {itemName: itemName}}">
              {{ getItemTitleByItemName(itemName) }}
            </router-link>
          </span>
          <span class="badge badge-default badge-pill">{{ count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ItemIcon from './ItemIcon.vue';

export default {
  name: 'Recipe',
  props: ['recipe', 'section'],
  components: {
    ItemIcon
  },
  data() {
    return {
      rootComponent: this.$parent.$parent
    };
  },
  methods: {
    getItemByName(itemName) {
      return this.rootComponent.getItemByName(itemName);
    },
    getItemTitleByItemName(itemName) {
      const item = this.getItemByName(itemName);
      return item === undefined ? itemName : item.title;
    }
  },
  computed: {
    outputItemName() {
      return Object.keys(this.recipe.output)[0];
    },
    outputItem() {
      return this.getItemByName(this.outputItemName);
    },
    title() {
      return this.getItemTitleByItemName(this.outputItemName);
    },
    headerId() {
      return 'heading_' + this.outputItemName;
    },
    collapseId() {
      return 'collapse_' + this.outputItemName;
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
