#!/usr/bin/env node
const fs = require('fs');
const json = require('comment-json');
// const util = require('util');

const items = json.parse(fs.readFileSync('src/items.json'));

// Validate items all have unique names by counting occurences.
const itemNames = {};
items.forEach(item => {
  if (typeof item.itemName === 'undefined') {
    console.error('ERROR: Item missing an itemName');
    console.error(item.inspect);
    return;
  }

  if (typeof itemNames[item.itemName] === 'undefined') {
    itemNames[item.itemName] = 0;
  }
  itemNames[item.itemName] += 1;
});
const dupeItemNames = Object.keys(itemNames).map(itemName => {
  return itemNames[itemName] > 1 ? itemName : null;
}).filter(v => {
  return v !== null;
});
if (dupeItemNames.length > 0) {
  console.log(dupeItemNames);
  return;
}

const recipes = json.parse(fs.readFileSync('src/recipes.json'));

recipes.forEach(recipe => {
  // Check input items exist.
  Object.keys(recipe.input).forEach(itemName => {
    const item = items.filter(item => {
      return item.itemName === itemName;
    }).pop();
    if (item === undefined) {
      console.error('Unknown input item: ' + itemName);
    }
  });

  // Check output items exist.
  Object.keys(recipe.output).forEach(itemName => {
    const item = items.filter(item => {
      return item.itemName === itemName;
    }).pop();
    if (item === undefined) {
      console.error('Unknown output item: ' + itemName);
    }
  });
});

console.log('TOTAL ITEMS: ' + items.length);
console.log('TOTAL RECIPES: ' + recipes.length);
