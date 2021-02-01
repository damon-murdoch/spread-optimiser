// autocomplete(list: string[]): object[]
// Returns a list of objects which will be 
// interpreted by the autocomplete library
// to generate the drop-down
function autocomplete(obj)
{
	// List of objects to return
	let lookup = [];
	
	// Keep track of the items
	let i = 0;
	
	// Iterate over autocomplete list
	for(let index in obj)
	{
		// Dereference the list object
		let item = obj[index];
		
		// Append the list item to the object array
		lookup.push({
			"id": i, // Index of the array
			"name": item.name, // Name of the element (name)
			"value": index, // Value of the element (key, id)
			"ignore": false
		});
		
		// Increment the counter
		i++;
	}
	
	// Return the generated array
	return lookup;
}

// lookup(key: string, object: object)
// 
function name_lookup(key,object)
{
	// Loop over the object
	for(obj in object)
	{
		// Dereference the object index
		let item = object[obj];
		
		// Check if the names match
		if (item.name == key)
		{
			// Return the item
			return item;
		}
	}
	
	// Nothing found, return null
	return null;
}

// function kv_map(object: object): list
function kv_map(object)
{
	// Object which will be returned
	let obj = {};
	
	// Dereference the keys from the object
	let keys = Object.keys(object);
	
	// Iterate over the keys array
	for(let i=0; i<keys.length; i++)
	{
		// Set the value of the key in the return to the index of the key in the original object
		obj[keys[i]] = i;
	}
	
	// Return the created object to the calling process
	return obj;
}