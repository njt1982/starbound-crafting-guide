<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <h1>Sidebar</h1>
        <form>
          <div class="form-group">
            <label for="filterItem">Search</label>
            <input v-model="filterText" type="text" class="form-control" id="filterItem" aria-describedby="filterItemHelp" placeholder="Start typing">
            <small id="filterItemHelp" class="form-text text-muted">As you type, items will appear below..</small>
          </div>
        </form>
        <ul>
          <Item v-for="item in filteredItems" v-bind:item="item" :key="item.key"></Item>
        </ul>
      </div>
      <div class="col-md-8">
        <h1>Detail</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Item from './Item.vue';
import _ from 'underscore';
// import items from '../items.json';

export default {
  name: 'Root',
  data() {
    return {
      items: require('../items.json'),
      filterText: ''
    };
  },
  components: {
    Item
  },
  computed: {
    filteredItems: function() {
      if (this.filterText === '') {
        return []
      };
      var lowerText = this.filterText.toLowerCase();

      return _.filter(this.items, function(item) {
        return ('title' in item) && item.title.toLowerCase().indexOf(lowerText) !== -1;
      }, this);
    }
  }
};
</script>
