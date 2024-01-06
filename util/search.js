// populate_species(id: string)
function populate_species(id) {
  // Get the select element from the form
  const select = document.getElementById(id);

  // Loop over the pokedex
  for (const key of PokedexKeys) {
    // Get the species from the key
    const species = Pokedex[key];

    // New option
    const option = document.createElement('option');

    // Set the value to the key
    option.value = key;

    // Set the content to the species
    option.innerHTML = species.name;

    // Add the option to the list
    select.appendChild(option);
  }
}

// lookup(key: string, object: object)
function name_lookup(key, object) {
  // Loop over the object
  for (obj in object) {
    // Dereference the object index
    let item = object[obj];

    // Check if the names match
    if (item.name == key) {
      // Return the item
      return item;
    }
  }

  // Nothing found, return null
  return null;
}

// function kv_map(object: object): list
function kv_map(object) {
  // Object which will be returned
  let obj = {};

  // Dereference the keys from the object
  let keys = Object.keys(object);

  // Iterate over the keys array
  for (let i = 0; i < keys.length; i++) {
    // Set the value of the key in the return to the index of the key in the original object
    obj[keys[i]] = i;
  }

  // Return the created object to the calling process
  return obj;
}
