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

  // Min/Max EV input field for the fields
  const max = document.getElementById(f + "-max");
  const min = document.getElementById(f + "-min");

  // Parse int from max input field
  let max_ev = parseInt(max.value);

  // Parse int from min input field
  let min_ev = parseInt(min.value);

  // Max is less than min
  if (max_ev < min_ev) {
    // Set max to min
    max.value = min.value;

    // Refresh max_ev
    max_ev = min_ev;
  }

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

  // Generate set
  generateSpread();
}

function updatePreset(f) {
  // Get the stat preset element
  const preset = document.getElementById("preset-" + f);

  // Get the value for the preset
  value = preset.value;

  // Get the options from the value
  options = value.split("/");

  // Selected stat is 'hp'
  if (f == 'hp') {
    // Wipe existing hp filter
    window.hpFilter = null;
  }

  // If there are exactly 3 options
  if (options.length == 3) {
    // Dereference values
    const iv = Math.min(Math.max(options[0], 0), 31);
    const evmin = Math.min(Math.max(options[1], 0), 252);
    const evmax = Math.min(Math.max(options[2], 0), 252);

    // Update the iv value in the document
    document.getElementById(f + "-iv").value = iv;

    // Update the min ev value in the document
    document.getElementById(f + "-min").value = evmin;

    // Update the max ev value in the document
    document.getElementById(f + "-max").value = evmax;

    // Update field based on preset
    updateField(f);

    // Reset dropdown
    preset.value = "none";
  }
  else if (options.length == 1) // Less than three options
  {
    // Field is 'hp'
    if (f == 'hp') {
      // Parse the the preset/filter for hp
      window.hpFilter = options[0];
    }

    // Leave dropdown as-is
  }

  // Update spread
  update();
}

function updateLevel(lvl=50) {

  // Convert level to number
  const level = parseInt(lvl);

  // Get the ratio input element
  const ratio = document.getElementById('ratio');

  // Calculate the new default hp ratio
  const value = getHPRatio(31, 252, level);

  // Update the input
  ratio.value = value;

  // General update
  update();
}

function update() {

  // Set nature
  setNature();

  // If an active Pokemon is selected
  if (window.active) {
    // Iterate over every field
    for (const field in fields) {
      // Update the selected field
      updateField(fields[field]);
    }

    // Generate set
    generateSpread();
  }
  // No active
  else {
    // Cannot continue
    console.error("No active Pokemon selected!");
  }
}

function getSpeedBenchmarks() {
  // Relevant base-speed numbers
  const commonSpeeds = [50, 60, 70, 80, 90, 95, 100, 110, 120, 130, 140];

  // Speed ev benchmarks
  const benchmarks = [];

  // Active species is defined
  if (window.active) {
    // Target speed stats
    const targetSpeeds = [];

    // Get the level for the calculations
    const level = document.getElementById("level").value;

    // Get the base speed stat for the species
    const baseSpeed = window.active.baseStats.spe;

    // Get the boost for the current nature
    const natureBoost = window.nature.spe;

    // Get minimum speed value for the level, nature, stats
    const speedMin = stat(baseSpeed, 31, 0, level, natureBoost);

    // Get maximum speed value for the level, nature, stats
    const speedMax = stat(baseSpeed, 31, 252, level, natureBoost);

    for (const commonSpeed of commonSpeeds) {
      // No investment, neutral nature
      const speedNo = stat(commonSpeed, 31, 0, level, 1.0);

      // Full investment, neutral nature
      const speedNeutral = stat(commonSpeed, 31, 252, level, 1.0);

      // Full investment, positive nature
      const speedPos = stat(commonSpeed, 31, 252, level, 1.1);

      if (speedPos < speedMin) {
        continue; // Not in range
      } else if (speedNo > speedMax) {
        break; // Out of range
      }

      // Add speeds to target speeds
      targetSpeeds.push(speedPos);

      // Check for neutral nature
      if (speedNeutral > speedMin) {
        targetSpeeds.push(speedNeutral);

        // Check for no investment
        if (speedNo > speedMin) {
          targetSpeeds.push(speedNo);
        }
      }
    }

    // Sort from slowest -> fastest
    targetSpeeds.sort();

    // Last speed stat
    lastStat = speedMin;

    // Loop from 0-252 speed evs
    for (let evs = 4; evs <= 252; evs += 4) {
      // No target speeds left, exit loop
      if (targetSpeeds.length == 0) {
        break;
      }

      // Get the current speed stat
      const speedStat = stat(baseSpeed, 31, evs, level, natureBoost);

      // Last stat is not defined, or new stat is higher
      if (lastStat == null || speedStat > lastStat) {
        // Loop over the target speeds
        for (const target in targetSpeeds) {
          // Get the stat for the target speed
          const targetSpeed = targetSpeeds[target];

          // We are faster than the target speed
          if (speedStat > targetSpeed) {
            // Add the evs to the benchmark
            benchmarks.push(evs);
            // Remove target from list
            targetSpeeds.splice(target, 1);
            break;
          }
        }
      }

      // Update last stat
      lastStat = speedStat;
    }
  }

  return benchmarks;
}

function getJumpStats(f) {
  // Jump stats (evs)
  const stats = [];

  // Pokemon is active
  if (window.active) {
    // Get the level for the calculations
    const level = document.getElementById("level").value;

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
        stats.push(e);
      }

      // Update last value
      lastValue = value;
    }
  }

  // Return jump stats
  return stats;
}

function getBestNature() {
  // pos/neg stats
  let pos = null;
  let neg = null;

  // All stats which can be modified by natures
  const natureStats = ["atk", "def", "spa", "spd", "spe"];

  // Pokemon is active
  if (window.active) {
    // Get the base stats for the species
    const baseStats = active.baseStats;

    // Attack is greater than SpA
    if (baseStats.atk > baseStats.spa) {
      // Make 'spa' negative stat
      natureStats.splice(natureStats.indexOf('spa'), 1);
      neg = 'spa';
    }
    else {
      // Make 'atk' negative stat
      natureStats.splice(natureStats.indexOf('atk'), 1);
      neg = 'atk';
    }

    // Best field/stat
    bestField = null;
    bestStat = 0;

    // Loop over the nature stats
    for (const field of natureStats) {
      // Get the field from the stats
      const stat = baseStats[field];

      // New greater than best
      if (stat > bestStat) {
        // Update best field/stat
        bestField = field;
        bestStat = stat;
      }
    }

    // Set 'pos' to bestField
    pos = bestField;

    // Loop over all of the battle natures
    for (const nature in BattleNatures) {
      // Get the nature data from the natures
      const natureData = BattleNatures[nature];

      // If positive and negative natures match
      if (natureData.pos == pos && natureData.neg == neg) {
        // Return the name of the nature
        return nature;
      }
    }
  }

  // Return 'hardy' by default
  return 'hardy';
}

function setNature() {
  // Get the selected nature from the input field
  const selected =
    BattleNatures[document.getElementById("nature-select").value];

  // Default preset innerhtml contents
  const selectTemplate = `<option value="none">Preset</option>
    <option value="31/4/252">4-252</option>
    <option value="31/4/244">4-244</option>
    <option value="31/0/252">0-252</option>
    <option value="31/0/244">0-244</option>
    <option value="31/252/252">252</option>
    <option value="31/244/244">244</option>
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

    switch (f) {
      case "hp":
        continue; // Skip
      case "spe":
        // Reset preset inner html value
        preset.innerHTML = selectTemplate;

        // Get the speed benchmarks for the species
        const benchmarks = getSpeedBenchmarks();

        // Loop over the jump stats
        for (const benchmark of benchmarks) {
          // Add the inner html to the preset
          preset.innerHTML += `<option value="31/${benchmark}/${benchmark}">${benchmark}</option>`;
        }
        // Do speed tier stuff
        break;
      default:
        // Reset preset inner html value
        preset.innerHTML = selectTemplate;

        // No jump stat, skip
        if (selected.pos == selected.neg) break; // Skip
        // Selected spread is positive
        if (f == selected.pos) {
          // Get the jump stats for the field
          const stats = getJumpStats(f);

          // Loop over the jump stats
          for (const jumpStat of stats) {
            // Add the inner html to the preset
            preset.innerHTML += `<option value="31/${jumpStat}/${jumpStat}">${jumpStat}</option>`;
          }
        }
        break;
    }

    // Update nature pos/neg select option
    document.getElementById(f + "-sel").value = window.nature[f].toString();
  }
}

function loadPokemonData(value) {
  // Set active Pokemon to the provided one
  window.active = value;

  // Update the Pokemon Sprite

  // Set_sprite from /util/sprite.js
  set_sprite(value);

  // Iterate over every field
  for (const field in fields) {
    // Get the active stat e.g. 'hp','at',...,'sp'
    f = fields[field];

    // If the stat is not the HP stat (which is not affected by natures)
    if (f != "hp") {
      // Reset the window object back to the default
      document.getElementById(f + "-def").selected = "selected";
    }

    // Reset ivs, min evs, max evs
    document.getElementById(f + "-iv").value = 31;
    document.getElementById(f + "-min").value = 4;
    document.getElementById(f + "-max").value = 252;

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

  // Get the best nature for the species
  const bestNature = getBestNature();

  // Reset natures to default
  document.getElementById("nature-select").value = bestNature;

  // Update all of the fields on the webpage
  // setNature();

  update();
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

function getEvSpread() {

  // EV Spread String
  const evSpread = [];

  // Loop over the indexes
  for (const index in fields) {

    // Get the field data
    const field = fields[index];

    // Get the ev result for the field
    const ev = parseInt(document.getElementById('result-' + field).value);
    if (ev > 0) { evSpread.push(`${ev} ${pretty_fields[index]}`); }
  }

  // At least one specified ev
  if (evSpread.length > 0) {
    // Return EV Spread array, joined as string
    return `EVs: ${evSpread.join(' / ')}`;
  }
  else // No specified evs
  {
    // Return null
    return null;
  }
}

function getIvSpread() {

  // EV Spread String
  const ivSpread = [];

  // Loop over the indexes
  for (const index in fields) {

    // Get the field data
    const field = fields[index];

    // Get the ev result for the field
    const iv = parseInt(document.getElementById(field + '-iv').value);
    if (iv < 31) { ivSpread.push(`${iv} ${pretty_fields[index]}`); }
  }

  // At least one specified iv
  if (ivSpread.length > 0) {
    // Return IV Spread array, joined as string
    return `IVs: ${ivSpread.join(' / ')}`;
  }
  else // No specified ivs
  {
    // Return null
    return null;
  }
}

function exportSpread() {

  // Spread string array
  const spread = [];

  // Species name
  let name = 'none';

  // Window is defined
  if (window.active) {
    // Get name from active species
    name = window.active.name;
  }

  // Add species name to spread
  spread.push(`${name} @ No Item`);

  // Add ev spread, if present
  const evs = getEvSpread();
  if (evs) { spread.push(evs); }

  // Add iv spread, if present
  const ivs = getIvSpread();
  if (ivs) { spread.push(ivs); }

  // Get the nature for the set
  const nature = document.getElementById('nature-select').value;

  // Add nature (Capitalised)
  spread.push(`${toCapitalCase(nature)} Nature`);

  // Return final string
  return spread.join(`\n`);
}

async function copyToClipboard(content) {
  // If the clipboard module exists in the client's browser
  if (navigator.clipboard) {

    try {
      // Copy the string to the clipboard
      await navigator.clipboard.writeText(content);

      // Successful copy alert
      window.alert(
        "Content copied to clipboard successfully."
      );
    } catch (err) {
      // Report the failure to the error console
      console.error(
        "Failed to copy content `" + content + "`! Reason: `" + err + "`"
      );
    }
  } // Clipboard module is not available
  else {
    // Report failure to console, continue
    console.error("Clipboard interaction not supported by browser.");
  }
}

// --- Add Event Listeners --- //

// Copy EVs event listener
document
  .getElementById("copy-evs")
  .addEventListener("click", async (event) => {
    // Copy the ev spread to the clipboard
    await copyToClipboard(getEvSpread());
  });

// Copy All event listener
document
  .getElementById("copy-all")
  .addEventListener("click", async (event) => {
    // Copy the ev spread to the clipboard
    await copyToClipboard(exportSpread());
  });