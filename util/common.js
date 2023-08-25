
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

function complexity() {
  let powers = [
    63, // 63 ^ 1 trivial
    3969, // 63 ^ 2 trivial
    250047, // 63 ^ 3 easy
    15752961, // 63 ^ 4 medium
    992436543, // 63 ^ 5 hard
    62523502209, // 63 ^ 6, impossible
  ];

  let ratings = ["Trivial", "Trivial", "Easy", "Medium", "Hard", "Very Hard"];

  let times = [
    "Instant",
    "Instant",
    "Quick",
    "Slow",
    "Impossible",
    "Impossible",
  ];

  op = [];

  for (field in fields) {
    let f = fields[field];

    max = parseInt(document.getElementById(f + "-max").value);
    min = parseInt(document.getElementById(f + "-min").value);

    o = (max - min) / 4;

    if (o) {
      op.push(o);
    } else {
      op.push(1);
    }
  }

  options = op[0] * op[1] * op[2] * op[3] * op[4] * op[5];

  accuracy = powers[5];
  closest = 0;

  for (power in powers) {
    p = powers[power];

    acc = Math.abs(p - options);

    if (acc < accuracy) {
      accuracy = acc;
      closest = power;
    }
  }

  let time = document.getElementById("time-label");

  // Specify the time which will be taken to complete the generation
  time.innerHTML = "<small>" + times[closest].toString() + "</small>";

  let complexity = document.getElementById("complexity-label");

  // Specify the level of complexity for the current
  complexity.innerHTML =
    "<small>n" +
    "<sup>" +
    (parseInt(closest) + 1).toString() +
    "</sup> (" +
    ratings[closest] +
    ") </small>";

  // Retrieve the div containing the solve button
  let solve = document.getElementById("solve");

  // If algorithm complexity is three or less
  if (closest < 4) {
    // Enable the generate button in the form
    solve.innerHTML =
      // '<p><a href="#" class="text-success" onClick="solve();"> Generate </a></p>';
      `<p><input type='submit' class='btn btn-link text-success' value='Generate'></p>`;
  } else {
    // Disable the generate button in the form
    solve.innerHTML = '<p class="text-danger"> Generate </p>';
  }
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
  }
  // Non-HP stat
  else {
    // Use normal algorithm
    best = stat(bs[f], iv, max_ev, level, window.nature[f]);
    worst = stat(bs[f], iv, min_ev, level, window.nature[f]);
  }

  // Update the page elements with the new minimum and maximum stats
  document.getElementById(f + "-stat-max").innerHTML = "Max: " + best;
  document.getElementById(f + "-stat-min").innerHTML = "Min: " + worst;

  // Update the computational complexity of the algorithm
  complexity();
}

function update() {
  // If an active Pokemon is selected
  if (window.active) {
    // Iterate over every field
    for (field in fields) {
      // Update the selected field
      updateField(fields[field]);
    }
  }
  // No active
  else {
    // Cannot continue
    console.error("No active Pokemon selected!");
  }
}

function setNature() {
  selected = BattleNatures[document.getElementById("nature-select").value];

  window.nature = {
    hp: 1,
    atk: 1,
    def: 1,
    spa: 1,
    spd: 1,
    spe: 1,
  };

  window.nature[selected.pos] += 0.1;
  window.nature[selected.neg] -= 0.1;

  for (field in fields) {
    let f = fields[field];

    if (f == "hp") {
      continue;
    }

    document.getElementById(f + "-sel").value = window.nature[f].toString();
  }

  update();
}

function showReport(evt, bst) {
  var i, tabContent, tabLinks;

  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById("tab-" + bst.toString()).style.display = "block";
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
