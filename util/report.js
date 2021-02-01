class Report
{
	constructor()
	{
		// If this is true, 
		// display will be re-called
		// after sorting.
		this.active = false;
		
		// Content of the table to be displayed
		this.content = [];
		
		// Page which is currently displayed
		this.page = 0;
		
		// Number of items displayed on each page
		this.count = 20;
		
		// Number of pages
		this.pageCount = 0;
		
		// Row which the table will be filtered byte
		this.row = 'BST';
		
		// Direction which the table will be sorted
		this.asc = false;
	}
	
	setPage(position)
	{
		// Switch on the button pressed
		switch(position)
		{
			case 'frst': 
				this.page = 0; // Go to the first page
			break;
			case 'prev': 
				this.page = this.page - 1; // Go to the previous page
			break;
			case 'next': 
				this.page = this.page + 1; // Go to the next page
			break;
			case 'last': 
				this.page=this.pageCount; // Go to the last page
			break;
			default:
			break;
		}
		
		// If the page variable is too low, set it to the minimum
		if (this.page < 0) this.page = 0;
		
		// If the page variable is too high, set it to the maximum
		if (this.page > this.pageCount) this.page = this.pageCount;
		
		// If there is a live table
		if(this.active)
		{
			// Update the live table
			this.display();
		}
	}
	
	setCount(count)
	{
		// Update the current count variable with the new count
		this.count = count;
		
		// Update page count
		this.getPageCount();
		
		// Make sure we haven't gone past the last page
		this.setPage();
		
		// If there is a live table
		if(this.active)
		{
			// Update the live table
			this.display();
		}
	}
	
	getPageCount()
	{
		// Page count is equal to the floor of the number of variables 
		this.pageCount = Math.floor(this.content.length / this.count);
	}
	
	insert(bst,ev,stat)
	{
		// Insert the given ev spread into the content array
		this.content.push({bst: bst, evs: ev, stats: stat});
		
		// Update the page count
		this.getPageCount();
	}
	
	display(page=this.page,count=this.count)
	{
		// If count is greater than 100, set it to 100
		count > 100 ? count = 100 : count = count;
		
		// Retrieve the table element from the page
		let table = document.getElementById('output-table');

		// Empty the table contents
		table.innerHTML = "";

		// Add the controls to the table
		table.innerHTML += "<tr id='control'>" + 
		   "<th scope='col'><p>Page</p></th>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setPage(\"frst\");'> First </a></td>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setPage(\"prev\");'> Back </a></td>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setPage(\"next\");'> Next </a></td>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setPage(\"last\");'> Last </a></td>" + 
		   "<th scope='col'><p>Items</p></th>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setCount(20);' > 20 </a><a href='#' onClick='document.report.setCount(40)';> 40 </a></td>" + 
		   "<td scope='col'><a href='#' onClick='document.report.setCount(60);' > 60 </a><a href='#' onClick='document.report.setCount(80)';> 80 </a></td>" + 
		   "</tr>"; 

		// Add the headers to the table
		table.innerHTML += "<tr id='header'>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"bst\");'>BST</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"hp\");'>HP</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"atk\");'>Atk</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"def\");'>Def</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"spa\");'>SpA</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"spd\");'>SpD</a></th>" + 
		   "<th scope='col'><a href='#' onClick='document.report.sort(\"spe\");'>Spe</a></th>" + 
		   "<th>Copy</th>" + 
		   "</tr>";
			
		// First entry which will be shown on the page of the table
		let start = (count * page);
			
		// Last entry which will be shown on the page - either up to the end of the array or the end of the page calculated (whichever is closest)
		let end = ((count * page) + count) < this.content.length ? ((count * page) + count) : this.content.length;

		// Iterate over all of the rows in the page
		for(let i = start; i < end; i++)
		{
			// Dereference the table row
			let spread = this.content[i];
			
			// Add the ev spread to the table
			table.innerHTML += "<tr>" +
				"<td>" + spread.bst + "<sub> Stats </sub></td>" + 
				"<td>" + spread.evs[0] + "<sub>" + spread.stats[0] + "</sub></td>" + 
				"<td>" + spread.evs[1] + "<sub>" + spread.stats[1] + "</sub></td>" + 
				"<td>" + spread.evs[2] + "<sub>" + spread.stats[2] + "</sub></td>" + 
				"<td>" + spread.evs[3] + "<sub>" + spread.stats[3] + "</sub></td>" + 
				"<td>" + spread.evs[4] + "<sub>" + spread.stats[4] + "</sub></td>" + 
				"<td>" + spread.evs[5] + "<sub>" + spread.stats[5] + "</sub></td>" + 
				"<td> <a href='#' onClick='document.report.clipboard(" + i + ")'> Clipboard </a></br>" + 
			"</tr>";
		}
		
		// Report is displayed, set as active
		this.active = true;
	}
	
	sort(row='bst')
	{
		// Valid Sort Arguments:
		// BST, HP, Atk, Def, SpA, SpD, Spe
		
		// Valid Order Arguments:
		// Asc, Dec
		
		// If the new row is the same as the old row
		if (row == this.row)
		{
			// flip the sort
			this.asc = !this.asc;
		}
		else // Different row
		{
			// Return the sort back to default
			this.asc = false;
			
			// set the last sort to the new one
			this.row = row;
		}
		
		// Initialise sort function variable
		let sortfunc = null;
		
		// Ascending or descending order
		let order = this.asc;
		
		switch(row)
		{
			case 'bst':
			
				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.bst > b.bst ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.bst < b.bst ? 1 : -1; }
				}
				
			break;
			case 'hp':
				
				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[0] > b.evs[0] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[0] < b.evs[0] ? 1 : -1; }
				}
				
			break;
			case 'atk':

				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[1] > b.evs[1] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[1] < b.evs[1] ? 1 : -1; }
				}

			break;
			case 'def':

				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[2] > b.evs[2] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[2] < b.evs[2] ? 1 : -1; }
				}

			break;
			case 'spa':
			
				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[3] > b.evs[3] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[3] < b.evs[3] ? 1 : -1; }
				}
				
			break;
			case 'spd':

				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[4] > b.evs[4] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[4] < b.evs[4] ? 1 : -1; }
				}

			break;
			case 'spe':
				
				// If we are using ascending order
				if(order)
				{	// Use an ascending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[5] > b.evs[5] ? 1 : -1; }
				}
				else
				{
					// Use a descending order sort function for the bst
					sortfunc = function(a,b){ return a.evs[5] < b.evs[5] ? 1 : -1; }
				}
				
			break;
			default:
				
				console.log('Default result called because argument "',row,'"did not match any cases.');

			break;
		}

		// Sort the array using the selected sort function
		this.content.sort(sortfunc);
		
		// If there is a live table
		if(this.active)
		{
			// Update the live table
			this.display();
		}
	}
	
	clipboard(row)
	{
	
		// Dereference the row searched for by the command
		let content = this.content[row];
	
		// Generate the string to be copied 
		
		/*
		str = "EVs: " + content.evs[0] + 'HP' + 
						content.evs[1] + 'Atk' + 
						content.evs[2] + 'Def' + 
						content.evs[3] + 'SpA' + 
						content.evs[4] + 'SpD' +
						content.evs[5] + 'Spe';
		*/
		
		let str = "EVs: ";
		
		// Iterate over all of the evs in the spread
		for(let i=0; i<content.evs.length; i++)
		{
			// If the EV string is greater than 0
			if(content.evs[i])
			{
				// Append the current EV to the EV string
				str += content.evs[i] + " " + fields[i];
				
				// If we are NOT on the last iteration
				if (i < content.evs.length-1)
				{
					// Add the '/' character
					str += ' / ';
				}
			}
		}
		
		// Create Text Area Element
		const el = document.createElement('textarea');
		
		// Assign the element value to the argument string
		el.value = str;
		
		// Append text area element to the document body
		document.body.appendChild(el);
		
		// Select the text area element
		el.select();
		
		// Perform the content copy command
		document.execCommand('copy');
		
		// Remove the text area element from the document body
		document.body.removeChild(el);
	}
}