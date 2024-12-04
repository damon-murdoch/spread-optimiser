// Custom hp modifier
function getHPMod() {
  const ratio = parseInt(document.getElementById('ratio').value);
  return 1.0 + (0.0001 * ratio);
}

// Get change in hp from e1 to e2
function getHPDelta(b, i, e1, e2, l) {
  const d1 = hp(b, i, e1, l);
  const d2 = hp(b, i, e2, l);
  
  console.log(d2,d1,getHPMod());

  return (d2 / d1) * getHPMod();
}

// Get change in stat from e1 and e2
function getStatDelta(b, i, e1, e2, l, n) {
  const d1 = stat(b, i, e1, l, n);
  const d2 = stat(b, i, e2, l, n);
  return (d2 / d1);
}

// Generic handler for both delta funcs
function getDelta(s, b, i, e1, e2, l, n) {
  if (s == "hp") {
    return getHPDelta(b, i, e1, e2, l);
  }

  return getStatDelta(b, i, e1, e2, l, n);
}

function getBestDelta(deltas) {
  let bestDelta = null;
  let bestValue = null;

  // Loop over the keys
  for (const delta in deltas) {
    // Dereference value
    const value = deltas[delta];

    // Value is not null, best value is null, new value is better
    if ((value && bestValue == null) || value > bestValue) {
      bestDelta = delta;
      bestValue = value;
    }
  }

  // Return best delta
  return bestDelta;
}

function getHPRange(b, i, eMin, eMax, l) {
  const evs = [];

  // Last stat recorded
  let lastStat = null;

  // Loop over the ev min/max range
  for (let e = eMin; e < eMax + 4; e += 4) {
    const currentStat = hp(b, i, e, l);

    // Stat matches the last stat
    if (currentStat == lastStat) {
      continue; // Skip
    }

    // Switch on hp filter
    switch (window.hpFilter) {
      case "16p1": // x/16 + 1
        if ((currentStat > 16) && (currentStat % 16 != 1)) {
          continue; // Skip if filter not matched
        }
        break;
      case "16": // x/16
        if ((currentStat > 16) && (currentStat % 16 != 0)) {
          continue; // Skip if filter not matched
        }
        break;
      case "10p1": // x/10 + 1
        if ((currentStat > 10) && (currentStat % 10 != 1)) {
          continue; // Skip if filter not matched
        }
        break;
      case "10m1": // x/10 - 1
        if ((currentStat > 10) && (currentStat % 10 != 9)) {
          continue; // Skip if filter not matched
        }
        break;
      case "4p1": // x/4 + 1
        if ((currentStat > 4) && (currentStat % 4 != 1)) {
          continue; // Skip if filter not matched
        }
        break;
      case "4": // x/4
        if ((currentStat > 4) && (currentStat % 4 != 0)) {
          continue; // Skip if filter not matched
        }
        break;
      case "2p1": // x/2 + 1
        if ((currentStat > 2) && (currentStat % 2 != 1)) {
          continue; // Skip if filter not matched
        }
        break;
      case "2": // x/2
        if ((currentStat > 2) && (currentStat % 2 != 0)) {
          continue; // Skip if filter not matched
        }
        break;
    }

    // Add to evs list
    evs.push(e);

    // Update last stat
    lastStat = currentStat;
  }

  return evs;
}

function getStatRange(b, i, eMin, eMax, l, n) {
  const evs = [];

  // Last stat recorded
  let lastStat = null;

  // Loop over the ev min/max range
  for (let e = eMin; e < eMax + 4; e += 4) {
    const currentStat = stat(b, i, e, l, n);

    // Stat matches the last stat
    if (currentStat == lastStat) {
      continue; // Skip
    }

    // Add to evs list
    evs.push(e);

    // Update last stat
    lastStat = currentStat;
  }

  return evs;
}

function getRange(s, b, i, eMin, eMax, l, n) {
  if (s == "hp") {
    return getHPRange(b, i, eMin, eMax, l);
  }

  return getStatRange(b, i, eMin, eMax, l, n);
}

function generateSpread() {
  // Get the level for the calculations
  const level = parseInt(document.getElementById("level").value);

  // Remaining evs
  let remainingEvs = 508;

  // Spread Data
  let spreadData = {};

  // Loop over the fields
  for (const field of fields) {
    // Break if no stats left
    if (remainingEvs == 0) break;

    // Default nature boost
    let nature = 1.0;

    // Get actual boost if field is not hp
    if (field != "hp") {
      nature = parseFloat(document.getElementById(field + "-sel").value);
    }

    // Base stat value for the species
    const base = active.baseStats[field];
    const min = parseInt(document.getElementById(field + "-min").value);
    const max = parseInt(document.getElementById(field + "-max").value);
    const ivs = parseInt(document.getElementById(field + "-iv").value);

    // Generate field constrains
    const fieldData = {
      completed: false, // Still processing
      nature: nature,
      base: base,
      min: min,
      max: max,
      ivs: ivs,
    };

    // Get the current ev value (min or remainder, if less)
    const ev = Math.min(min, remainingEvs);

    // Subtract 'ev' from remainder
    remainingEvs -= ev;

    // Update field evs
    fieldData.evs = ev;

    // Update field range
    fieldData.range = getRange(field, base, ivs, min, max, level, nature);

    // Create the field constraints element
    spreadData[field] = fieldData;
  }

  // While remainder is non-zero
  while (remainingEvs > 0) {
    // EVs Table
    const evs = {};

    // Deltas Table
    const deltas = {};

    // Loop over the fields
    for (const field of fields) {
      // Get the data for the field
      const fieldData = spreadData[field];

      // Spread has not reached the max
      if (fieldData.completed == false && fieldData.evs < fieldData.max) {

        // Get the index of the next value
        const nextIndex = fieldData.range.indexOf(fieldData.evs) + 1;

        // If the next index is in range
        if (nextIndex < fieldData.range.length) {
          // Get next value in the range array
          const nextValue = fieldData.range[nextIndex];

          // Update deltas array
          deltas[field] = getDelta(
            field,
            fieldData.base,
            fieldData.ivs,
            fieldData.evs,
            nextValue,
            level,
            fieldData.nature
          );

          // Update evs array
          evs[field] = nextValue;
        }

      }
    }

    // Get the best
    const bestField = getBestDelta(deltas);

    // No best field found
    if (bestField == null) {
      break; // Done processing
    }

    // Get the data, evs for the best field
    const bestData = spreadData[bestField];
    const bestEvs = evs[bestField];

    // Get the difference between new, old
    const diff = bestEvs - bestData.evs;

    // Non-zero change
    if (diff > 0) {
      // Diff is greater than allowed
      if (diff > remainingEvs) {
        // No changes can be made to this field
        spreadData[bestField].completed = true;
      } // Diff is in range
      else {
        // Add the evs to the spread data
        spreadData[bestField].evs += diff;

        // Take the evs from the remainder
        remainingEvs -= diff;
      }
    } // No change
    else {
      break; // Exit loop
    }
  }

  // Loop over the fields
  for (const field of fields) {
    // Get the result element for the field
    const result = document.getElementById("result-" + field);
    const resultStat = document.getElementById(field + "-stat-result");

    // Get the field data from the spread
    const fieldData = spreadData[field];

    // If field is set
    if (field in spreadData) {
      // Update the result value for the provided field
      result.value = fieldData.evs;
    } // Field not set
    else {
      // Set to zero
      result.value = 0;
    }

    // Field is hp
    if (field == "hp") {
      // Get the result value from the hp
      resultStat.innerHTML = hp(
        fieldData.base,
        fieldData.ivs,
        result.value,
        level
      );
    } // Field is not hp
    else {
      // Get the result value from the hp
      resultStat.innerHTML = stat(
        fieldData.base,
        fieldData.ivs,
        result.value,
        level,
        fieldData.nature
      );
    }
  }

  // Return remaining evs
  return remainingEvs;
}
