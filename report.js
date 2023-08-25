function getNature(params) {
  const selected = BattleNatures[params.get('nature') ?? 'quirky'];

  const list = [];

  const nature = {
    hp: 1,
    atk: 1,
    def: 1,
    spa: 1,
    spd: 1,
    spe: 1,
  };

  nature[selected.pos] += 0.1;
  nature[selected.neg] -= 0.1;

  for (field in fields) {
    let f = fields[field];
    list.push(nature[f]);
  }

  return list;
}


// function getMinEVs(void): list
// Return a list containing all of the minimum ev input elements
function getMinEVs(params) {
  return [
    parseInt(params.get("hp-min") ?? 0),
    parseInt(params.get("atk-min") ?? 0),
    parseInt(params.get("def-min") ?? 0),
    parseInt(params.get("spa-min") ?? 0),
    parseInt(params.get("spd-min") ?? 0),
    parseInt(params.get("spe-min") ?? 0),
  ];
}

// function getMaxEVs(void): list
// Return a list containing all of the maximum ev input elements
function getMaxEVs(params) {
  return [
    parseInt(params.get("hp-max") ?? 252),
    parseInt(params.get("atk-max") ?? 252),
    parseInt(params.get("def-max") ?? 252),
    parseInt(params.get("spa-max") ?? 252),
    parseInt(params.get("spd-max") ?? 252),
    parseInt(params.get("spe-max") ?? 252),
  ];
}

// function getIVs(void): list
// Return a list containing all of the requested iv input elements
function getIVs(params) {
  return [
    parseInt(params.get("hp-iv") ?? 31),
    parseInt(params.get("atk-iv") ?? 31),
    parseInt(params.get("def-iv") ?? 31),
    parseInt(params.get("spa-iv") ?? 31),
    parseInt(params.get("spd-iv") ?? 31),
    parseInt(params.get("spe-iv") ?? 31),
  ];
}

// function getBases(void): list
// Return a list containing all of the base stat input elements
function getBases(params) {
  return [
    parseInt(params.get("hp-base")),
    parseInt(params.get("atk-base")),
    parseInt(params.get("def-base")),
    parseInt(params.get("spa-base")),
    parseInt(params.get("spd-base")),
    parseInt(params.get("spe-base")),
  ];
}

// function getFilters(void): list
// Return a list containing all of the minimum filter input elements
function getFilters(params) {
  return [
    (params.get("hp-16m1") ?? false) === true, 
    (params.get("hp-10p1") ?? false) === true, 
    (params.get("hp-10m1") ?? false) === true, 
    (params.get("hp-4") ?? false) === true, 
    (params.get("hp-4p1") ?? false) === true, 
    (params.get("hp-even") ?? false) === true, 
  ];
}

function solve(params) {
  // Tree, used for depth-first search
  const spreads = new Tree();

  // Minimum EVs from the input form
  const evs_min = getMinEVs(params);

  // Maximum EVs from the input form
  const evs_max = getMaxEVs(params);

  // Requested IVs from the input form
  const ivs = getIVs(params);

  // Base stat total for the selected Pokemon
  const bases = getBases(params);

  // HP Filters checked in the form
  const filters = getFilters(params);

  // Get nature stat distribution
  const natureMod = getNature(params);

  // Report, is used to generate the output table
  const report = new Report(
    // Species name (default: dragapult)
    params.get('species') ?? 'dragapult',
    // Spread level (default: 50)
    params.get('level') ?? 50, 
    // Spread nature (default: quirky)
    params.get('nature') ?? 'quirky'
  );

  // Integer contained in the webpage level input field
  const level = parseInt(params.get("level"));

  // Dereference the minimum EVs
  const start = JSON.parse(JSON.stringify(evs_min));

  // Generate the list of valid hp numbers

  // Dereference the minimum valid hp number
  let hp_min = hp(bases[0], ivs[0], evs_min[0], level);

  // Dereference the maximum valid hp number
  let hp_max = hp(bases[0], ivs[0], evs_max[0], level);

  // Generate the list of valid HP numbers between
  // the minimum and maximum value
  let hp_range = range(hp_min, hp_max);

  // List of valid hp numbers
  let hp_valid = [];

  // Iterate over the hp stats
  for (let i = 0; i < hp_range.length; i++) {
    // Dereference the current HP number
    let hp_cur = hp_range[i];

    // If the hp stat has to be divisible by 16 - 1
    if (filters[0]) {
      // If the remainder of (i+1) divided by 16
      // is equal to zero, the spread meets the filter
      if ((hp_cur + 1) % 16 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // If the hp stat has to be divisible by 10 + 1
    if (filters[1]) {
      // If the remainder of (i-1) divided by 10
      // is equal to zero, the spread meets the filter
      if ((hp_cur - 1) % 10 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // If the hp stat has to be divisible by 10 - 1
    if (filters[2]) {
      // If the remainder of (i+1) divided by 10
      // is equal to zero, the spread meets the filter
      if ((hp_cur + 1) % 10 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // If the hp stat has to be divisible by 4
    if (filters[3]) {
      // If the remainder of i divided by 4
      // is equal to zero, the spread meets the filter
      if (hp_cur % 4 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // If the hp stat has to be divisible by 4 + 1
    if (filters[4]) {
      // If the remainder of i divided by 4
      // is equal to zero, the spread meets the filter
      if ((hp_cur - 1) % 4 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // If the hp stat has to be divisible by 2
    if (filters[5]) {
      // If the remainder of i divided by 4
      // is equal to zero, the spread meets the filter
      if (hp_cur % 2 == 0) {
        // Number meets the filter, keep going
      } else {
        // Number does not meet the filter, skip
        continue;
      }
    }

    // Append the current hp stat to the list of valid hp stats
    hp_valid.push(hp_cur);
  }

  // Iterate over the base stats
  for (let i = 0; i < bases.length; i++) {
    // If there are less than 508 total EVs in the
    // minumum EVs AND the minimum stat is less than the highest possible stat
    if (sum(start) < 508 && start[i] < evs_max[i]) {
      // Holy fuck these algorithms are complicated
      // How did I even write this?
      508 - sum(start) < evs_max[i] - start[i]
        ? (start[i] += 508 - sum(start))
        : (start[i] += evs_max[i] - start[i]);
    }
  }

  // Create a queue, containing the starting phase
  const queue = [start];

  // While there are items left in the queue
  while (queue.length) {
    // Pop the top element off the queue
    const spread = queue.pop();

    // If we have not already looked at this spread
    if (!spreads.find(JSON.parse(JSON.stringify(spread)))) {

      // Get the base stats of the Pokemon with the current spread
      const stats = total(bases, ivs, spread, level, natureMod);

      // Get the base stat total from the generated stats
      const bst = sum(stats);

      // Add the new spread to the list of spreads already calculated
      spreads.insert(JSON.parse(JSON.stringify(spread)));

      // If the spread matches a valid HP number
      if (hp_valid.includes(stats[0])) {
        // Add the new spread to the report
        report.insert(bst, JSON.parse(JSON.stringify(spread)), stats);
      } else {
        // No need to do anything, HP stat does not match the filter
      }

      // Increment, Decrement variables
      let inc = [];
      let dec = [];

      // Iterate over each base stat
      for (i = 0; i < bases.length; i++) {
        // If the maximum EVs is less than or equal to
        // the current spread + 4, add it to the increment list
        if (evs_max[i] >= spread[i] + 4) {
          inc.push(i);
        }

        // If the minimum EVs is greater than or equal to
        // the current spread - 4, add it to the decrement list
        if (evs_min[i] <= spread[i] - 4) {
          dec.push(i);
        }
      }

      // Iterate over the increment list
      for (i = 0; i < inc.length; i++) {
        // Increment over the decrement list
        for (d = 0; d < dec.length; d++) {
          // Dereference the spread, as a new object
          let t = JSON.parse(JSON.stringify(spread));

          // Add 4 to the inc row,
          // take 4 from the dec row

          t[inc[i]] += 4;
          t[dec[d]] -= 4;

          // Spread to the queue
          queue.push(t);
        }
      }
    }
  }

  document.report = report;

  document.report.sort();
  document.report.display();
}

// Populate the species dropdown
populate_species("pokemon");

// Get the current URL
const url = new URL(window.location.href);

// Get the parameters from the page
const params = new URLSearchParams(url.search);

// Get the species from the params
const species = params.get("species");

// Update the species from the params
document.getElementById("pokemon").value = species;

// Get the level from the params
document.getElementById("level").value = params.get("level");

// Set the sprite
set_sprite(species);

// Solve the spread
solve(params);
