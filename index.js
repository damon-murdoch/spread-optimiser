const fields = ['hp','atk','def','spa','spd','spe'];

function pad(n,width,z)
{
	z = z || '0';
	n = n + '';
	
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function updateField(f)
{
	let active = window.active;
	let bs = active.baseStats;
	
	max_ev = parseInt(document.getElementById(f + '-max').value);
	min_ev = parseInt(document.getElementById(f + '-min').value);
	level = parseInt(document.getElementById('level').value);
	iv = parseInt(document.getElementById(f + '-iv').value);
			
	var best,worst;
			
	if(f == 'hp')
	{
		console.log(bs[f] + ',' + iv + ',' + max_ev + ',' + level);
		best = hp(bs[f],iv,max_ev,level);
		console.log(best);
				
		console.log(bs[f] + ',' + iv + ',' + min_ev + ',' + level);
		worst = hp(bs[f],iv,min_ev,level);
		console.log(worst);
	}
	else
	{
		console.log(bs[f] + ',' + iv + ',' + max_ev + ',' + level + ',' + window.natures[f]);
		best = stat(bs[f],iv,max_ev,level,window.natures[f]);
		console.log(best);
				
		console.log(bs[f] + ',' + iv + ',' + min_ev + ',' + level + ',' + window.natures[f]);
		worst = stat(bs[f],iv,min_ev,level,window.natures[f]);
		console.log(worst);
	}
	
	document.getElementById(f + '-stat-max').innerHTML = 'Max: ' + best;
	document.getElementById(f + '-stat-min').innerHTML = 'Min: ' + worst;
}

function update()
{
	
	if(window.active)
	{
		for (field in fields)
		{
			updateField(fields[field]);
		}
	}
	else
	{
		console.error('No active Pokemon selected!');
	}
}

function loadPokemonData(value)
{
	// Set active Pokemon to the provided one
	window.active = BattlePokedex[value];
	
	// Reset natures to default
	window.natures = {};

	// Iterate over every field
	for (field in fields)
	{
		// Get the active stat e.g. 'hp','at',...,'sp'
		f = fields[field];
		
		// Reset the nature boost for the field to neutral
		window.natures[f] = 1.0;
		
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
	placeholder.placeholder = "Active: " + active.species;

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
	img.src = 'img/' + pad(active.num,3) + '.png';
	
	// If file is not found
	if (img.height == 0)
	{
		// Use default
		img.src = 'img/000.png';
	}
	
	// Append the created sprite object to the parent positioning object
	document.getElementById('select-sprite').appendChild(img);
	
	update();
}