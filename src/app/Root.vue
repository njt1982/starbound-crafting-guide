<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4">
        <form>
          <div class="form-group">
            <h1><label for="filterItem">Search</label></h1>
            <input v-model="filterText" type="text" class="form-control" id="filterItem" aria-describedby="filterItemHelp" placeholder="Start typing">
            <small id="filterItemHelp" class="form-text text-muted">As you type, items will appear below..</small>
          </div>
        </form>
        <div class="list-group">
          <button v-for="item in filteredItems" v-on:click="select(item)" class="list-group-item list-group-item-action">
            <ItemIcon :icon="item.icon" />
            {{ item.title }}
          </button>
        </div>
      </div>
      <div class="col-md-8">
        <div v-if="selectedItem">
          <ItemDetails v-if="selectedItem" :item="selectedItem"></ItemDetails>
        </div>
        <div v-else>
          <p>Search and select an item on the left</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore';
import ItemDetails from './ItemDetails.vue';
import ItemIcon from './ItemIcon.vue';

export default {
  name: 'Root',
  data() {
    return {
      // loading: false,
      items: require('../items.json'),
      selectedItem: null,
      filterText: ''
    };
  },
  components: {
    ItemDetails,
    ItemIcon
  },
  created() {
    if (typeof this.$route.params.itemName !== 'undefined') {
      this.setDefaultSearch(this.$route.params.itemName);
    }
  },
  watch: {
    '$route'(to) {
      if (typeof to.params.itemName !== 'undefined') {
        this.setDefaultSearch(this.$route.params.itemName);
      }
    }
  },
  methods: {
    setDefaultSearch(itemName) {
      this.selectedItem = this.getItemByName(itemName);
      this.filterText = this.selectedItem.title;
    },
    getItemByName(itemName) {
      return _.findWhere(this.items, {itemName});
    },
    select(item) {
      this.$router.push(item.itemName);
    }
  },
  computed: {
    filteredItems() {
      if (this.filterText === '') {
        return [];
      }
      const lowerText = this.filterText.toLowerCase();
      // const response = [];
      // const count = 0;
      // this.items.forEach(item => {
      //   if (('title' in item) && item.title.toLowerCase().indexOf(lowerText) !== -1) {
      //     response.push(item);
      //     count += 1;
      //   }
      // });
      // return response;

      return _.filter(this.items, item => {
        return ('title' in item) && item.title.toLowerCase().indexOf(lowerText) !== -1;
      }, this).splice(0, 20);
    }
  }
};
</script>
