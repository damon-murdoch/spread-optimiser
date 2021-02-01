const fields = ['hp','atk','def','spa','spd','spe'];

// function pad(n: int, width: int, z: string): string
// Pad a given number 'n' to width 'width', with the width 'z'.
function pad(n,width,z = '0')
{
	// Cast the provided number 'n' to a string
	n = n + '';
	
	// If the provided number is longer than the width 'width',
	// just return the number casted to a string
	
	// Otherwise, return the number padded to the left with 'z'
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// function getMinEVs(void): list
// Return a list containing all of the minimum ev input elements
function getMinEVs()
{
	return [
		parseInt(document.getElementById('hp-min').value),
		parseInt(document.getElementById('atk-min').value),
		parseInt(document.getElementById('def-min').value),
		parseInt(document.getElementById('spa-min').value),
		parseInt(document.getElementById('spd-min').value),
		parseInt(document.getElementById('spe-min').value)
	];
}

// function getMaxEVs(void): list
// Return a list containing all of the maximum ev input elements
function getMaxEVs()
{
	return [
		parseInt(document.getElementById('hp-max').value),
		parseInt(document.getElementById('atk-max').value),
		parseInt(document.getElementById('def-max').value),
		parseInt(document.getElementById('spa-max').value),
		parseInt(document.getElementById('spd-max').value),
		parseInt(document.getElementById('spe-max').value)
	];
}

// function getIVs(void): list
// Return a list containing all of the requested iv input elements
function getIVs()
{
	return [
		parseInt(document.getElementById('hp-iv').value),
		parseInt(document.getElementById('atk-iv').value),
		parseInt(document.getElementById('def-iv').value),
		parseInt(document.getElementById('spa-iv').value),
		parseInt(document.getElementById('spd-iv').value),
		parseInt(document.getElementById('spe-iv').value)
	];
}

// function getBases(void): list
// Return a list containing all of the base stat input elements
function getBases()
{
	return [
		parseInt(document.getElementById('hp-base').value),
		parseInt(document.getElementById('atk-base').value),
		parseInt(document.getElementById('def-base').value),
		parseInt(document.getElementById('spa-base').value),
		parseInt(document.getElementById('spd-base').value),
		parseInt(document.getElementById('spe-base').value)
	];
}

// function getFilters(void): list
// Return a list containing all of the minimum filter input elements
function getFilters()
{
	return [
		document.getElementById('hp-16m1').checked,
		document.getElementById('hp-10p1').checked,
		document.getElementById('hp-10m1').checked,
		document.getElementById('hp-4').checked,
		document.getElementById('hp-4p1').checked,
		document.getElementById('hp-even').checked
	];
}

// function sum(list: list): int
// Returns the sum of all numbers stored
// in a given list object 'list'.
function sum(list)
{
	// Counter variable
	let ct=0;
	
	// iterate over all items in the list
	for(let i=0; i < list.length; i++)
	{
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
function range(a,b)
{
	// List to be returned
	let list=[];
	
	// Iterate from 'a' to 'b'
	for(let i=a; i<=b; i++)
	{
		// Append 'i' to the return list
		list.push(i);
	}
	
	// Return the generated list
	return list;
}

// spreadStr(spread: object)
// Returns a clean string with the spread's stats
// Format: HP / ATK / DEF / SPA / SPD / SPE
function spreadStr(spread)
{
	return spread[0] + '/' + spread[1] + '/' + spread[2] + '/' + spread[3] + '/' + spread[4] + '/' + spread[5];
}

function solve()
{
	// Tree, used for depth-first search
	spreads = new Tree();
	
	// Report, is used to generate the output table
	report = new Report();

	// Minimum EVs from the input form
	evs_min = getMinEVs();
	
	// Maximum EVs from the input form
	evs_max = getMaxEVs();
	
	// Requested IVs from the input form
	ivs = getIVs();
	
	// Base stat total for the selected Pokemon
	bases = getBases();

	// HP Filters checked in the form
	filters = getFilters();	

	// Get the stat distribution due to nature of the active pokemon
	nature_ = Object.values(window.nature);
	
	// Integer contained in the webpage level input field
	level = parseInt(document.getElementById('level').value);
	
	// Dereference the minimum EVs
	start = JSON.parse(JSON.stringify(evs_min));
	
	// Generate the list of valid hp numbers

	// Dereference the minimum valid hp number
	let hp_min = hp(bases[0],ivs[0],evs_min[0],level);
	
	// Dereference the maximum valid hp number
	let hp_max = hp(bases[0],ivs[0],evs_max[0],level);
	
	// Generate the list of valid HP numbers between
	// the minimum and maximum value
	let hp_range = range(hp_min,hp_max);
	
	// List of valid hp numbers
	let hp_valid = [];
	
	// Iterate over the hp stats
	for(let i=0; i < hp_range.length; i++)
	{
		// Dereference the current HP number
		let hp_cur = hp_range[i];
		
		// If the hp stat has to be divisible by 16 - 1
		if (filters[0])
		{
			// If the remainder of (i+1) divided by 16
			// is equal to zero, the spread meets the filter
			if ((hp_cur+1) % 16 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			}
		}
		
		// If the hp stat has to be divisible by 10 + 1
		if (filters[1])
		{
			// If the remainder of (i-1) divided by 10
			// is equal to zero, the spread meets the filter
			if ((hp_cur-1) % 10 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			} 
		}
		
		// If the hp stat has to be divisible by 10 - 1
		if (filters[2])
		{
			// If the remainder of (i+1) divided by 10
			// is equal to zero, the spread meets the filter
			if ((hp_cur+1) % 10 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			}
		}
		
		// If the hp stat has to be divisible by 4
		if (filters[3])
		{
			// If the remainder of i divided by 4
			// is equal to zero, the spread meets the filter
			if (hp_cur % 4 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			}
		}
		
		// If the hp stat has to be divisible by 4 + 1
		if (filters[4])
		{
			// If the remainder of i divided by 4
			// is equal to zero, the spread meets the filter
			if ((hp_cur-1) % 4 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			}
		}
		
		// If the hp stat has to be divisible by 2
		if (filters[5])
		{
			// If the remainder of i divided by 4
			// is equal to zero, the spread meets the filter
			if (hp_cur % 2 == 0)
			{
				// Number meets the filter, keep going
			}
			else
			{
				// Number does not meet the filter, skip
				continue;
			}
		}
		
		// Append the current hp stat to the list of valid hp stats
		hp_valid.push(hp_cur);
	}

	// Iterate over the base stats
	for (let i=0; i < bases.length; i++)
	{
		// If there are less than 508 total EVs in the 
		// minumum EVs AND the minimum stat is less than the highest possible stat
		if(sum(start) < 508 && start[i] < evs_max[i])
		{
			// Holy fuck these algorithms are complicated
			// How did I even write this?
			(508 - sum(start) < evs_max[i] - start[i]) ? start[i] += (508 - sum(start)) : start[i] += (evs_max[i] - start[i]);
		}
	}
	
	// Create a queue, containing the starting phase
	queue = [start];
	
	// While there are items left in the queue
	while(queue.length)
	{
		// Pop the top element off the queue
		spread = queue.pop();
		
		// If we have not already looked at this spread
		if (!(spreads.find(JSON.parse(JSON.stringify(spread)))))
		{
			// Get the base stats of the Pokemon with the current spread
			stats = total(bases,ivs,spread,level,nature_);
			
			// Get the base stat total from the generated stats
			bst = sum(stats);

			// Add the new spread to the list of spreads already calculated
			spreads.insert(JSON.parse(JSON.stringify(spread)));

			// If the spread matches a valid HP number
			if(hp_valid.includes(stats[0]))
			{				
				// Add the new spread to the report
				report.insert(bst,JSON.parse(JSON.stringify(spread)),stats);
			}
			else
			{
				// No need to do anything, HP stat does not match the filter
			}

			// Increment, Decrement variables
			let inc = [];
			let dec = [];
			
			// Iterate over each base stat
			for(i=0; i<bases.length; i++)
			{
				// If the maximum EVs is less than or equal to
				// the current spread + 4, add it to the increment list
				if(evs_max[i] >= spread[i] + 4)
				{inc.push(i);}
			
				// If the minimum EVs is greater than or equal to
				// the current spread - 4, add it to the decrement list
				if(evs_min[i] <= spread[i] - 4)
				{dec.push(i);}
			}

			// Iterate over the increment list
			for(i=0; i<inc.length; i++)
			{
				// Increment over the decrement list
				for(d=0; d<dec.length; d++)
				{
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

function complexity()
{
	let powers = [
		63, // 63 ^ 1 trivial
		3969, // 63 ^ 2 trivial
		250047, // 63 ^ 3 easy
		15752961, // 63 ^ 4 medium
		992436543, // 63 ^ 5 hard
		62523502209 // 63 ^ 6, impossible
	];
	
	let ratings = [
		'Trivial',
		'Trivial',
		'Easy',
		'Medium',
		'Hard',
		'Very Hard'
	];
	
	let times = [
		'Instant',
		'Instant',
		'Quick',
		'Slow',
		'Impossible',
		'Impossible'
	];
	
	op = [];
	
	for(field in fields)
	{
		let f = fields[field];
		
		max = parseInt(document.getElementById(f + '-max').value)
		min = parseInt(document.getElementById(f + '-min').value);
		
		o = ((max - min) / 4);
		
		if(o)
		{
			op.push(o);
		}
		else
		{
			op.push(1);
		}
	}
	
	options = op[0] * op[1] * op[2] * op[3] * op[4] * op[5];
	
	accuracy = powers[5];
	closest = 0;
	
	for(power in powers)
	{
		p = powers[power];
		
		acc = Math.abs(p - options);
		
		if(acc < accuracy)
		{
			accuracy = acc;
			closest = power;
		}
	}

	let time = document.getElementById('time-label');
	
	// Specify the time which will be taken to complete the generation
	time.innerHTML = "<small>" + times[closest].toString() + "</small>";
	
	let complexity = document.getElementById('complexity-label');

	// Specify the level of complexity for the current 
	complexity.innerHTML = "<small>n" +
		"<sup>" + (parseInt(closest) + 1).toString() + "</sup> (" + ratings[closest] + ") </small>";

	// Retrieve the div containing the solve button
	let solve = document.getElementById('solve');

	// If algorithm complexity is three or less
	if(closest < 4)
	{
		// Enable the generate button in the form
		solve.innerHTML = '<p><a href="#" class="text-success" onClick="solve();"> Generate </a></p>';
	}
	else
	{
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
function updateField(f)
{
	// Dereference active Pokemon
	let active = window.active;
	
	// Dereference active Pokemon base stats
	let bs = active.baseStats;
	
	// Integer contained in the webpage maximum EV input field for the field
	max_ev = parseInt(document.getElementById(f + '-max').value);
	
	// Integer contained in the webpage minimum EV input field for the field
	min_ev = parseInt(document.getElementById(f + '-min').value);
	
	// Integer contained in the webpage level input field
	level = parseInt(document.getElementById('level').value);
	
	// Integer contained in the webpage IV input field for the field
	iv = parseInt(document.getElementById(f + '-iv').value);
	
	// Best and worst possible stat given inputs
	var best,worst;
	
	// If given stat is 'hp'
	if(f == 'hp')
	{
		// Use hp algorithm
		best = hp(bs[f],iv,max_ev,level);
		worst = hp(bs[f],iv,min_ev,level);
	}
	// Non-HP stat
	else
	{
		// Use normal algorithm
		best = stat(bs[f],iv,max_ev,level,window.nature[f]);
		worst = stat(bs[f],iv,min_ev,level,window.nature[f]);
	}
	
	// Update the page elements with the new minimum and maximum stats
	document.getElementById(f + '-stat-max').innerHTML = 'Max: ' + best;
	document.getElementById(f + '-stat-min').innerHTML = 'Min: ' + worst;
	
	// Update the computational complexity of the algorithm
	complexity();
}

function update()
{
	// If an active Pokemon is selected
	if(window.active)
	{
		// Iterate over every field
		for (field in fields)
		{
			// Update the selected field
			updateField(fields[field]);
		}
	}
	// No active
	else
	{
		// Cannot continue
		console.error('No active Pokemon selected!');
	}
}

function setNature()
{
	selected = BattleNatures[document.getElementById('nature-select').value];

	window.nature = {
		hp : 1,
		atk : 1,
		def : 1,
		spa : 1,
		spd : 1,
		spe : 1
	}

	window.nature[selected.pos] += 0.1;
	window.nature[selected.neg] -= 0.1;
	
	for (field in fields)
	{
		let f = fields[field];
		
		if(f=='hp')
		{
			continue;
		}
		
		document.getElementById(f + '-sel').value = window.nature[f].toString();
	}

	update();
}

function showReport(evt,bst)
{
	var i, tabContent, tabLinks;
	
	tabcontent = document.getElementsByClassName('tabcontent');
	
	for (i = 0; i < tabcontent.length; i++) 
	{
		tabcontent[i].style.display = "none";
	}
	
	tablinks = document.getElementsByClassName("tablinks");
    
	for (i = 0; i < tablinks.length; i++) 
	{
		tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
	
	document.getElementById('tab-' + bst.toString()).style.display = "block";
}

function loadPokemonData(value)
{
	// Set active Pokemon to the provided one
	window.active = value;
	
	// Reset natures to default
	window.nature = {};
	
	// Update the Pokemon Sprite
	
	// Set_sprite from /util/sprite.js
	set_sprite(value);

	// Iterate over every field
	for (field in fields)
	{
		// Get the active stat e.g. 'hp','at',...,'sp'
		f = fields[field];
		
		// Reset the nature boost for the field to neutral
		window.nature[f] = 1.0;
		
		// If the stat is not the HP stat (which is not affected by natures)
		if (f != 'hp')
		{
			// Reset the window object back to the default
			document.getElementById(f+'-def').selected = "selected";
		}
		
		// Reset the field base stats object to the Pokemon's default
		document.getElementById(f+'-base').value = active.baseStats[f];
	}

	// Set the input text field placeholder text to display the active Pokemon
	let placeholder = document.getElementById('pokemon');
	placeholder.placeholder = "Active: " + active.name;

	// If image object already exists in the page
	if(document.contains(document.getElementById('icon')))
	{
		// Remove it
		document.getElementById('icon').remove();
	}
	
	// Create new image element
	var img = document.createElement("img");

	// Assign image unique ID
	img.id = "icon";
	
	// Attempt to assign the image its sprite if one is present
	img.src = ('img/ms/' + selectMenuSprite(window.active));

	// Append the created sprite object to the parent positioning object
	document.getElementById('select-sprite').appendChild(img);
	
	// Update all of the fields on the webpage
	setNature();
}

// Runs whenever the Pokemon lookup field is modified
function changePokemonData()
{
	// Dereference the value of the Pokemon Search Bar
	let pokemon = document.getElementById('pokemon').value;
	
	// Name_lookup: Function from /util/search.js
	// Check to see if the value of the search bar matches 
	// the name of a Pokemon
	
	let lookup = name_lookup(pokemon,document.pokedex);
	
	// If the search bar matches a Pokemon
	if (lookup)
	{
		// Load the Pokemon's data into memory
		loadPokemonData(lookup);
	}
	else // If it does not match a Pokemon
	{
		// Do nothing
	}
}

// Code that runs once the page has loaded
$(document).ready(function(){
	
	// Set the pokedex to a document variable
	document.pokedex = BattlePokedex;
	
	// Autocomplete: Function from /util/search.js
	// Generate an object which will be used by the autofill
	document.pokedex_lookup = autocomplete(document.pokedex);
	
	// Create an autofill on the Pokemon search box
	$('#pokemon').autocomplete({
		nameProperty: 'name',
		valueProperty: 'value',
		dataSource: document.pokedex_lookup,
		filterOn: 'input',
		autoSelect: true
	});
	
	// Set the default egg sprite
	set_sprite(0);
});