const fields = ['hp','atk','def','spa','spd','spe'];

/*
	Description: 
		Given a number, return that 
		number as a string padded by
		the requested number of zeros.
	
	Parameters:	
		N: Number to pad
		Width: Width to pad
		Z: (Not Required) Join Element
		
	Notes:
		Author: Damon Murdoch
		Date: 22/11/2019
*/
function pad(n,width,z)
{
	z = z || '0';
	n = n + '';
	
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

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

function getFilters()
{
	return [
		parseInt(document.getElementById('hp-16m1').checked),
		parseInt(document.getElementById('hp-10p1').checked),
		parseInt(document.getElementById('hp-10m1').checked),
		parseInt(document.getElementById('hp-4').checked),
		parseInt(document.getElementById('hp-4p1').checked),
		parseInt(document.getElementById('hp-2p1').checked),
		
	];
}

function sum(list)
{
	let ct=0;
	
	for(let i=0; i < list.length; i++)
	{
		ct += list[i];
	}
	
	return ct;
}

function spreadStr(spread)
{
	return spread[0] + '/' + spread[1] + '/' + spread[2] + '/' + spread[3] + '/' + spread[4] + '/' + spread[5];
}

function solve()
{
	spreads = new Tree();
	report = new Report();

	evs_min = getMinEVs();
	evs_max = getMaxEVs();
	ivs = getIVs();
	bases = getBases();
	
	filters = getHPFilters();
	
	// Get the stat distribution due to nature of the active pokemon
	nature_ = Object.values(window.nature);
	
	// Integer contained in the webpage level input field
	level = parseInt(document.getElementById('level').value);
	
	start = JSON.parse(JSON.stringify(evs_min));
	
	for (i=0; i < bases.length; i++)
	{
		if(sum(start) < 508 && start[i] < evs_max[i])
		{
			(508 - sum(start) < evs_max[i] - start[i]) ? start[i] += (508 - sum(start)) : start[i] += (evs_max[i] - start[i]);
		}
	}
	
	queue = [start];
	
	while(queue.length)
	{
		spread = queue.pop();
		
		if (!(spreads.find(JSON.parse(JSON.stringify(spread)))))
		{
			stats = total(bases,ivs,spread,level,nature_);
			bst = sum(stats);
			
			spreads.insert(JSON.parse(JSON.stringify(spread)));
			report.insert(bst,JSON.parse(JSON.stringify(spread)),stats);

			let inc = [];
			let dec = [];
			
			for(i=0; i<bases.length; i++)
			{
				if(evs_max[i] >= spread[i] + 4)
				{inc.push(i);}
				if(evs_min[i] <= spread[i] - 4)
				{dec.push(i);}
			}

			for(i=0; i<inc.length; i++)
			{
				for(d=0; d<dec.length; d++)
				{
					let t = JSON.parse(JSON.stringify(spread));
					
					t[inc[i]] += 4;
					t[dec[d]] -= 4;
					
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
});