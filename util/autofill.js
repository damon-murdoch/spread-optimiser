/*
Name: autofill.js
Date: 26/10/2018
Creator: Damon Murdoch (@SirScrubbington)
Description: 
	Simple autofill for Pokemon search, original implementation from w3schools
	https://www.w3schools.com/howto/howto_js_autocomplete.asp
*/

function autocomplete(inp, arr, key) 
{
	inp.addEventListener("input", function(e) 
	{
		let li = [];

		for(let pokemon in BattlePokedex)
		{
			if (pokemon.startsWith(inp.value.toLowerCase().replace('-','')))
			{
				li.push(pokemon);
			}
		}
		
		if (li.length == 1)
		{
			loadPokemonData(li[0]);
			inp.value = '';
		}
	});
	
	inp.addEventListener("keydown", function(e)
	{
		if(e.keyCode == 13)
		{
			event.preventDefault();

			if (Object.keys(BattlePokedex).includes(inp.value.toLowerCase().replace('-','')))
			{
				loadPokemonData(inp.value.toLowerCase().replace('-',''));
				inp.value = '';
			}
		}
	});
}