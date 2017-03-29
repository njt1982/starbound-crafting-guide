#!/usr/bin/env node

const fs = require('fs');
const json = require('comment-json');
const glob = require('glob');

const args = process.argv.slice(2);

// Get the input directory. Force remove trailing slash.
let inDir = args[0];
if (inDir[inDir.length - 1] === '/') {
  inDir = inDir.substr(0, inDir.length - 1);
}
console.log('input dir: ' + inDir);

// Load all recipes
const recipes = [];
glob.sync('recipes/**/*.recipe', {cwd: inDir}).forEach(file => {
  const recipeSource = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);

  const output = {};
  output[recipeSource.output.item] = recipeSource.output.count;
  const input = {};
  recipeSource.input.forEach(item => {
    input[item.item] = item.count;
  });

  recipes.push({
    input,
    output
  });
});

/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
Array.prototype.itemNameIn = function (group, itemName) {
  return this.map((item, index) => {
    return itemName in item[group] ? index : undefined;
  }).filter(isFinite);
};

// Define item extensions.
const items = [];
const itemTypes = [
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
  'wiretool'
];

// Parse all items
const itemExtensions = itemTypes.join('|');
glob.sync('items/**/*.@(' + itemExtensions + ')', {cwd: inDir}).forEach(file => {
  const item = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);

  items.push({
    itemName: item.itemName,
    price: item.price || null,
    category: item.category,
    icon: item.inventoryIcon,
    title: item.shortdescription,
    description: item.description,
    recipes: recipes.itemNameIn('input', item.itemName),
    makes: recipes.itemNameIn('output', item.itemName)
  });
});

fs.writeFileSync('src/recipes.json', JSON.stringify(recipes, null, 2), {mode: 0o664});
fs.writeFileSync('src/items.json', JSON.stringify(items, null, 2), {mode: 0o664});
