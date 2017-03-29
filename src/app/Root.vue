<template>
  <div class="container">
    <div class="loading" v-if="loading">
      <h1 class="col-md-12">Loading...</h1>
    </div>

    <div class="row" v-if="items">
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
import $ from 'jquery';
import ItemDetails from './ItemDetails.vue';

export default {
  name: 'Root',
  data() {
    return {
      loading: false,
      items: null,
      selectedItem: null,
      filterText: ''
    };
  },
  components: {
    ItemDetails
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.items = null;
      this.loading = true;
      $.get('/items.json', data => {
        this.items = data;
        this.loading = false;
      });
    },
    select(item) {
      console.log(item);
      this.selectedItem = item;
    }
  },
  computed: {
    filteredItems() {
      if (this.filterText === '') {
        return [];
      }
      const lowerText = this.filterText.toLowerCase();

      return _.filter(this.items, item => {
        return ('title' in item) && item.title.toLowerCase().indexOf(lowerText) !== -1;
      }, this);
    }
  }
};
</script>
