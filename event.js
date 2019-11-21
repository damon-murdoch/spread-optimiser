/*
	Description:
		Code which executes once the webpage has finished loading.
		
		This script creates the name (pokemon name) and index (pokemon index)
		arrays, loads the pokedex data into them and then assigns the element
		with the ID 'input' to have autocomplete features using the Pokemon names.

	Notes:
		Author: Damon Murdoch
		Date: 21/11/2019
*/

window.addEventListener("load",function()
{
	let names = [];
	let index = [];
	
	for (pkmn in BattlePokedex)
	{
		names.push(BattlePokedex[pkmn].species);
		index.push(pokemon);
	}
	
	autocomplete(document.getElementById('input'),names,indexes);
});