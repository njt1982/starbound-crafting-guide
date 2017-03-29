#!/usr/bin/env node

var fs = require('fs'),
    json = require('comment-json'),
    // _ = require('underscore'),
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
var recipes = [];
glob.sync('recipes/**/*.recipe', { cwd: inDir }).forEach(function(file) {
  var recipeSource = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);

  var output = {};
  output[recipeSource.output.item] = recipeSource.output.count;
  var input = {};
  recipeSource.input.forEach(function(item) { input[item.item] = item.count });

  recipes.push({
    input: input,
    output: output,
  });
});

Array.prototype.itemNameIn = function(group, itemName) {
  return this.map(function(item, index) { return itemName in item[group] ? index : undefined }).filter(isFinite);
}

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
    recipes: recipes.itemNameIn('input', item.itemName),  //recipes.filter(function(recipe) { return item.itemName in recipe.input; }),
    makes: recipes.itemNameIn('output', item.itemName), //recipes.filter(function(recipe) { return item.itemName in recipe.output; }),
  };

  items[item.itemName] = newItem;
});

// Write Out
var output = '';
output = output.concat('var recipes = ', JSON.stringify(recipes, null, 2), ";\n");
output = output.concat('var items = ', JSON.stringify(items, null, 2), ";\n");

fs.writeFileSync('guide.js', output, { mode: 0o664});

