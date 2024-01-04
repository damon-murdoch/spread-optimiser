
// Stat field names
const fields = ["hp", "atk", "def", "spa", "spd", "spe"];

// Pretty stat field names
const pretty_fields = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

// Returns a given number formatted with commas
function getCommaString(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// toCapitalCase(str: string)
// Returns the provided string
// with the first letter of each
// word capitalised.
function toCapitalCase(str) {
  // Split the string on the spaces
  let spl = str.split(" ");

  // Loop over the string splits
  for (let i = 0; i < spl.length; i++) {
    // If the string is greater
    // than one character
    if (spl[i].length > 1) {
      // Capitalise the first letter, add the rest as lowercase
      spl[i] = spl[i].charAt(0).toUpperCase() + spl[i].slice(1).toLowerCase();
    } // String is one or less characters
    else {
      // Convert the string to upper case
      spl[i] = spl[i].toUpperCase();
    }
  }

  // Join the split string on spaces
  return spl.join(` `);
}

// function pad(n: int, width: int, z: string): string
// Pad a given number 'n' to width 'width', with the width 'z'.
function pad(n, width, z = "0") {
  // Cast the provided number 'n' to a string
  n = n + "";

  // If the provided number is longer than the width 'width',
  // just return the number casted to a string

  // Otherwise, return the number padded to the left with 'z'
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// function sum(list: list): int
// Returns the sum of all numbers stored
// in a given list object 'list'.
function sum(list) {
  // Counter variable
  let ct = 0;

  // iterate over all items in the list
  for (let i = 0; i < list.length; i++) {
    // Increment the counter with the value of the current item
    ct += list[i];
  }

  // Return the counter variable
  return ct;
}

// function range(a: int, b: int): list
// Returns a list of numbers ranging
// from a, the start point to b, the
// end point.
function range(a, b) {
  // List to be returned
  let list = [];

  // Iterate from 'a' to 'b'
  for (let i = a; i <= b; i++) {
    // Append 'i' to the return list
    list.push(i);
  }

  // Return the generated list
  return list;
}

// spreadStr(spread: object)
// Returns a clean string with the spread's stats
// Format: HP / ATK / DEF / SPA / SPD / SPE
function spreadStr(spread) {
  return (
    spread[0] +
    "/" +
    spread[1] +
    "/" +
    spread[2] +
    "/" +
    spread[3] +
    "/" +
    spread[4] +
    "/" +
    spread[5]
  );
}

/*
  Description: 
    Triggered after a change, update the page elements
    associated with that field, primarily the maximum
    and minimum subtitle.
	
  Parameters:	
    F: Field to be updated
  	
  Notes:
    Author: Damon Murdoch
    Date: 22/11/2019
*/
function updateField(f) {
  // Dereference active Pokemon
  let active = window.active;

  // Dereference active Pokemon base stats
  let bs = active.baseStats;

  // Integer contained in the webpage maximum EV input field for the field
  max_ev = parseInt(document.getElementById(f + "-max").value);

  // Integer contained in the webpage minimum EV input field for the field
  min_ev = parseInt(document.getElementById(f + "-min").value);

  // Integer contained in the webpage level input field
  level = parseInt(document.getElementById("level").value);

  // Integer contained in the webpage IV input field for the field
  iv = parseInt(document.getElementById(f + "-iv").value);

  // Best and worst possible stat given inputs
  var best, worst;

  // If given stat is 'hp'
  if (f == "hp") {
    // Use hp algorithm
    best = hp(bs[f], iv, max_ev, level);
    worst = hp(bs[f], iv, min_ev, level);
  } else {
    // Use normal algorithm
    best = stat(bs[f], iv, max_ev, level, window.nature[f]);
    worst = stat(bs[f], iv, min_ev, level, window.nature[f]);
  }

  // Update the page elements with the new minimum and maximum stats
  document.getElementById(f + "-stat-max").innerHTML = "Max: " + best;
  document.getElementById(f + "-stat-min").innerHTML = "Min: " + worst;
}

function updatePreset(f) {

  // Get the stat preset element
  const preset = document.getElementById("preset-" + f);

  // Get the value for the preset
  value = preset.value;

  // Get the options from the value
  options = value.split('/');

  // If there are exactly 3 options
  if (options.length == 3) {

    // Dereference values
    const iv = Math.min(Math.max(options[0], 0), 31);
    const evmin = Math.min(Math.max(options[1], 0), 252);
    const evmax = Math.min(Math.max(options[2], 0), 252);

    // Update the iv value in the document
    document.getElementById(f + '-iv').value = iv;

    // Update the min ev value in the document
    document.getElementById(f + '-min').value = evmin;

    // Update the max ev value in the document
    document.getElementById(f + '-max').value = evmax;

    // Update field based on preset
    updateField(f)
  }

  // Update spread
  update();
}

function update() {
  // If an active Pokemon is selected
  if (window.active) {
    // Iterate over every field
    for (const field in fields) {
      // Update the selected field
      updateField(fields[field]);
    }

    // Generate set
    generateSpread()
  }
  // No active
  else {
    // Cannot continue
    console.error("No active Pokemon selected!");
  }
}

function generateSpread() {

  // Remaining evs
  let remainder = 508;

  // Spread Data
  let spread = {

  }

  // Loop over the fields
  for(const field of fields) {

    // Break if no stats left
    if (remainder == 0)
      break;

    // Generate field constrains
    const field_data = {
      "base": active.baseStats[field], 
      "min": parseInt(document.getElementById(field + '-min').value),
      "max": parseInt(document.getElementById(field + '-max').value),
      "iv": parseInt(document.getElementById(field + '-iv').value), 
    }

    // Get the current ev value (min or remainder, if less)
    const ev = Math.min(field_data["min"], remainder);

    // Subtract 'ev' from remainder
    remainder -= ev;

    // Update the field data
    field_data["ev"] = ev;

    // Create the field constraints element
    spread[field] = field_data;
  }

  // While remainder is non-zero
  while(remainder >= 0){
    // Next calculation step
    const step = {

    };

    // Loop over the fields
    for (const field of fields){
      
    }
  }

  // Loop over the fields
  for (const field of fields){

    // Get the result element for the field
    const result = document.getElementById('result-' + field);

    // If field is set
    if (field in spread){
      // Update the result value for the provided field
      result.value = spread[field].ev;
    }
    else // Field not set
    {
      // Set to zero
      result.value = 0;
    }
  }

  // Return remaining evs
  return remainder;
}

function getJumpStats(f) {

  // Jump stats (evs)
  const stats = [];

  // Pokemon is active
  if (window.active) {

    // Get the level for the calculations
    const level = document.getElementById('level').value;

    // Get the base stats for the species
    const baseStats = active.baseStats;

    // Get the stat for the field
    const baseStat = baseStats[f];

    // Last value (placeholder)
    let lastValue = 0;

    // Loop over all of the evs
    for (let e = 0; e < 256; e += 4) {
      
      // Get the stat for the nature
      value = stat(baseStat, 31, e, level, 1.1);
      
      // Last value is not zero, and new value is a jump stat
      if (lastValue > 0 && value == lastValue + 2) {

        // Add 'e' to stats
        stats.push(e)
      }

      // Update last value
      lastValue = value;
    }
  }

  // Return jump stats
  return stats;
}

function setNature() {

  // Get the selected nature from the input field
  const selected = BattleNatures[document.getElementById("nature-select").value];

  // Default preset innerhtml contents
  const selectTemplate = `<option value="none">Select Preset</option>
    <option value="31/252/252">252</option>
    <option value="31/4/252">4-252</option>
    <option value="31/0/252">0-252</option>
    <option value="31/4/4">4</option>
    <option value="31/0/0">0</option>
    <option value="0/0/0">0/0</option>`;

  window.nature = {
    hp: 1,
    atk: 1,
    def: 1,
    spa: 1,
    spd: 1,
    spe: 1,
  };

  // Update window nature values
  window.nature[selected.pos] += 0.1;
  window.nature[selected.neg] -= 0.1;

  // Loop over the fields
  for (const field in fields) {
    let f = fields[field];

    // Field preset value
    const preset = document.getElementById("preset-" + f);

    // Reset preset inner html value
    preset.innerHTML = selectTemplate;

    switch (f) {
      case 'hp':
        continue; // Skip
      case 'spe':
        // Do speed tier stuff
        break;
      default:
        // No jump stat, skip
        if (selected.pos == selected.neg)
          continue; // Skip
        // Selected spread is positive
        if (f == selected.pos) {
          // Get the jump stats for the field
          const stats = getJumpStats(f);

          // Loop over the jump stats
          for(const jumpStat of stats) {
            // Add the inner html to the preset
            preset.innerHTML += `<option value="31/${jumpStat}/${jumpStat}">${jumpStat}</option>`
          }
        }
      break;
    }

    // Update nature pos/neg select option
    document.getElementById(f + "-sel").value = window.nature[f].toString();
  }

  update();
}

function loadPokemonData(value) {
  // Set active Pokemon to the provided one
  window.active = value;

  // Reset natures to default
  window.nature = {};

  // Update the Pokemon Sprite

  // Set_sprite from /util/sprite.js
  set_sprite(value);

  // Iterate over every field
  for (const field in fields) {
    // Get the active stat e.g. 'hp','at',...,'sp'
    f = fields[field];

    // Reset the nature boost for the field to neutral
    window.nature[f] = 1.0;

    // If the stat is not the HP stat (which is not affected by natures)
    if (f != "hp") {
      // Reset the window object back to the default
      document.getElementById(f + "-def").selected = "selected";
    }

    // Reset the field base stats object to the Pokemon's default
    document.getElementById(f + "-base").value = active.baseStats[f];
  }

  // Set the input text field placeholder text to display the active Pokemon
  let placeholder = document.getElementById("pokemon");
  placeholder.placeholder = "Active: " + active.name;

  // If image object already exists in the page
  if (document.contains(document.getElementById("icon"))) {
    // Remove it
    document.getElementById("icon").remove();
  }

  // Create new image element
  var img = document.createElement("img");

  // Assign image unique ID
  img.id = "icon";

  // Attempt to assign the image its sprite if one is present
  img.src = "img/ms/" + selectMenuSprite(window.active);

  // Append the created sprite object to the parent positioning object
  document.getElementById("select-sprite").appendChild(img);

  // Update all of the fields on the webpage
  setNature();
}

// Runs whenever the Pokemon lookup field is modified
function changePokemonData() {
  // Dereference the value of the Pokemon Search Bar
  let pokemon = document.getElementById("pokemon").value;

  // Get the entry from the pokedex
  let lookup = Pokedex[pokemon];

  // If the search bar matches a Pokemon
  if (lookup) {
    // Load the Pokemon's data into memory
    loadPokemonData(lookup);
  } // If it does not match a Pokemon
  else {
    // Log to console
    console.warn(`Unrecognised species: '${pokemon}'!`);
  }
}
