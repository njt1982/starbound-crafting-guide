#!/usr/bin/env node

var fs = require('fs'),
    json = require('comment-json'),
//    _ = require('underscore'),
    // parsePath = require('parse-filepath'),
    glob = require('glob');


var args = process.argv.slice(2);

// Get the input directory. Force remove trailing slash.
var inDir = args[0];
if (inDir[inDir.length - 1] === '/') {
  inDir = inDir.substr(0, inDir.length-1);
}
console.log('input dir: ' + inDir);

// Load all recipes
var recipes = {}, makes = {};
glob.sync('recipes/**/*.recipe', { cwd: inDir }).forEach(function(file) {
  var recipe = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);

  // Loop over input components and for each one, add the recipe to that item list.
  recipe.input.forEach(function(inputItem) {
    if (typeof recipes[inputItem.item] === 'undefined') {
      recipes[inputItem.item] = [];
    }
    recipes[inputItem.item].push(recipe);
  });

  // Now store this recipe against the output item
  if (typeof makes[recipe.output.item] === 'undefined') {
    makes[recipe.output.item] = [];
  }
  makes[recipe.output.item].push(recipe);
});

// Define item extensions.
var items = {};
var itemTypes = [
  'activeitem',
  'augment',
  'back',
  'beamaxe',
  'chest',
  'consumable',
  'currency',
  'flashlight',
  'harvestingtool',
  'head',
  'inspectiontool',
  'instrument',
  'item',
  'legs',
  'liqitem',
  'matitem',
  'miningtool',
  'painttool',
  'thrownitem',
  'tillingtool',
  'unlock',
  'weaponability',
  'wiretool',
];

// Parse all items
var itemExtensions = itemTypes.join('|');
glob.sync('items/**/*.@(' + itemExtensions + ')', { cwd: inDir }).forEach(function(file) {
  item = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);
  var newItem = {
    price: item.price || null,
    category: item.category,
    icon: item.inventoryIcon,
    title: item.shortdescription,
    description : item.description,
    recipes: [],
    makes: [],
  };

  if (recipes[item.itemName] !== undefined) {
    newItem.recipes = recipes[item.itemName];
  }
  if (makes[item.itemName] !== undefined) {
    newItem.makes = makes[item.itemName];
  }

  items[item.itemName] = newItem;
});

fs.writeFileSync('guide.js', items, { mode: 0o664});

