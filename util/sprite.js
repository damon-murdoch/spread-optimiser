// get_sprite(id: int): void
// Given a pokemon id, (attempt to)
// update the sprite displayed in
// the sprite box for the given pokemon.
function set_sprite() {
  // Get the selected pokemon from the select drop-down
  const species_id = document.getElementById("pokemon").value;

  // Find the species in the pokedex array
  const species = Pokedex[species_id];

  // Dereference the sprite object for the pokemon
  const sprite = document.getElementById(`select-sprite`);

  // If the search was successful
  if (species) {

    // Convert the species to lower case (and replace space with dash)
    const species_lower = species.name.toLowerCase().replace(' ','-');

    // Generate the filename
    let filename = `img/box/${species_lower}.png`;

    // Set the sprite source to the generated image name
    sprite.src = filename;
  }
}
