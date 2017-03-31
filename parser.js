#!/usr/bin/env node

const fs = require('fs');
const json = require('comment-json');
const glob = require('glob');
const ProgressBar = require('progress');
// const mkdirp = require('mkdirp');
const cpFile = require('cp-file');

const args = process.argv.slice(2);

// Get the input directory. Force remove trailing slash.
let inDir = args[0];
if (inDir[inDir.length - 1] === '/') {
  inDir = inDir.substr(0, inDir.length - 1);
}
console.log('input dir: ' + inDir);

const imgBasepath = 'src/images';

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
  'wiretool'
].join('|');

let files;
let bar;
let iconURL;
const fileErrors = [];

// Parse all items
files = glob.sync('items/**/*.@(' + itemTypes + ')', {cwd: inDir});
bar = new ProgressBar('  processing item files   [:bar] :percent :etas', {
  width: 50,
  total: files.length
});
files.forEach(file => {
  const item = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);
  bar.tick();
  if (typeof item !== 'object') {
    console.error('item not an object');
    console.error(file);
    return;
  }
  if (typeof item.itemName !== 'string') {
    console.error('item missing itemName');
    console.error(item);
    console.error(file);
    return;
  }

  let icon = null;
  if (typeof item.inventoryIcon === 'string') {
    icon = item.inventoryIcon;
  } else if (typeof item.inventoryIcon === 'object') {
  // Seems to be used by activeItems?! It's an array of one object thats an image.
    icon = item.inventoryIcon.pop().image;
  } else if (item.inventoryIcon !== undefined) {
    // This is non-undefined, non-object, non-string....
    console.error('Unknown icon type for: ' + file);
    console.log(item);
  }

  // Copy the icon file if its set AND ends in PNG...
  // Need to deal with framed/animtaion sprites (eg file.png.1)
  if (icon !== null && icon.endsWith('.png')) {
    const path = file.substring(0, file.lastIndexOf('/'));
    let iconOutputFile;
    let iconInputFile;
    if (icon.startsWith('/item')) {
      iconInputFile = [inDir, icon].join('/');
      iconOutputFile = [imgBasepath, icon].join('');
    } else {
      iconInputFile = [inDir, path, icon].join('/');
      iconOutputFile = [imgBasepath, path, icon].join('/');
    }

    try {
      cpFile.sync(iconInputFile, iconOutputFile);
      iconURL = iconOutputFile.replace(/^src/, '');
    } catch (err) {
      fileErrors.push(err.message);
    }
  }

  items.push({
    sourceFile: file,
    itemName: item.itemName,
    type: 'item',
    price: item.price || null,
    category: item.category,
    icon: iconURL,
    rarity: item.rarity,
    title: item.shortdescription,
    description: item.description,
    recipes: recipes.itemNameIn('input', item.itemName),
    makes: recipes.itemNameIn('output', item.itemName)
  });
});

// Parse all objects
files = glob.sync('objects/**/*.object', {cwd: inDir});
bar = new ProgressBar('  processing object files [:bar] :percent :etas', {
  width: 50,
  total: files.length
});

files.forEach(file => {
  const object = json.parse(fs.readFileSync(inDir + '/' + file).toString(), null, false);
  bar.tick();

  if (typeof object !== 'object') {
    console.error('object not an object');
    console.error(object);
    return;
  }
  if (typeof object.objectName !== 'string') {
    console.error('object missing objectName');
    console.error(object);
    console.error(file);
    return;
  }

  let icon = null;
  if (typeof object.inventoryIcon === 'string') {
    icon = object.inventoryIcon;
  } else if (typeof object.inventoryIcon === 'object') {
  // Seems to be used by activeItems?! It's an array of one object thats an image.
    icon = object.inventoryIcon.pop().image;
  } else if (object.inventoryIcon !== undefined) {
    // This is non-undefined, non-object, non-string....
    console.error('Unknown icon type for: ' + file);
    console.log(object);
  }

  // Copy the icon file if its set AND ends in PNG...
  // Need to deal with framed/animtaion sprites (eg file.png.1)
  let iconURL;
  if (icon !== null && icon.endsWith('.png')) {
    const path = file.substring(0, file.lastIndexOf('/'));
    let iconOutputFile;
    let iconInputFile;
    if (icon.startsWith('/item')) {
      iconInputFile = [inDir, icon].join('/');
      iconOutputFile = [imgBasepath, icon].join('');
    } else {
      iconInputFile = [inDir, path, icon].join('/');
      iconOutputFile = [imgBasepath, path, icon].join('/');
    }

    try {
      cpFile.sync(iconInputFile, iconOutputFile);
      iconURL = iconOutputFile.replace(/^src/, '');
    } catch (err) {
      fileErrors.push(err.message);
    }
  }

  items.push({
    itemName: object.objectName,
    type: 'object',
    price: object.price || null,
    icon: iconURL,
    rarity: object.rarity,
    title: object.shortdescription,
    description: object.description,
    recipes: recipes.itemNameIn('input', object.objectName),
    makes: recipes.itemNameIn('output', object.objectName)
  });
});

if (fileErrors.length > 0) {
  console.error(fileErrors);
}

fs.writeFileSync('src/recipes.json', JSON.stringify(recipes, null, 2), {mode: 0o664});
fs.writeFileSync('src/items.json', JSON.stringify(items, null, 2), {mode: 0o664});
