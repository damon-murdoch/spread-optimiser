class Report
{
	constructor()
	{
		this.content = {};
	}
	
	insert(bst,ev,stat)
	{
		// console.log('calling insert...' + '"{ evs: ' + ev + '; stats: ' + stat + '}"');

		if(Object.keys(this.content).includes(bst.toString()))
		{
			// console.log('appending "{ evs: ' + ev + '; stats: ' + stat + '}" to key "' + bst + '"');
			this.content[bst].push({evs: ev, stats: stat});
		}
		else
		{
			// console.log('creating new key "' + bst + '" with value "{ evs: ' + ev + '; stats: ' + stat + '}"');
			this.content[bst] = [{evs: ev, stats: stat}];
		}
	}
	
	/*
	<div id='table-menu'>
		<table class='table' id='output-table-bst'>
		<!--
		<tr>
			<th> BST </th>
			<th> HP </th>
			<th> Atk </th>
			<th> Def </th>
			<th> SpA </th>
			<th> SpD </th>
			<th> Spe </th>
			<th> Copy </th>
		</tr>
		<tr>
			<td> EVs <p class='ev-subtitle'> Raw Stats </p></td>
			<td> HP	<p class='ev-subtitle'> HP Stat </p></td>						
			<td> Atk <p class='ev-subtitle'> Atk Stat </p></td>						
			<td> Def <p class='ev-subtitle'> Def Stat </p></td>						
			<td> SpA <p class='ev-subtitle'> SpA Stat </p></td>						
			<td> SpD <p class='ev-subtitle'> SpD Stat </p></td>						
			<td> Spe <p class='ev-subtitle'> Spe Stat </p></td>
			<td>
				<a href='#' onClick=""> EVs Only </a>
				</br>
				<a href='#' onClick=""> Full Set </a>
			</td>
		</tr>
		-->
		</table>
	</div>
	*/
	
	display()
	{
		console.log(Object.keys(this.content));
		
		let order = Object.keys(this.content).sort(function(a,b){
			return a.toString() < b.toString();
		})

		let output = document.getElementById('output-table');
		
		output.innerHTML = '';
		
		for(let i=0; i < order.length; i++)
		{
			output.innerHTML += '<div><h5> BST: ' + order[i] + ' (Spreads: ' + this.content[order[i]].length + ') </h5><a class="toggle" id="toggle-table-' + order[i] + '" href=# onClick="report.toggle(' + order[i] + ')"> [Show] </a></div>';
			output.innerHTML += '<table class="table" id="table-' + order[i] + '"></table>';
		}			
	}
	
	toggle(active)
	{
		let table = document.getElementById('table-' + active.toString());
		let tgl = document.getElementById('toggle-table-' + active.toString());

		if(!(table.innerHTML))
		{
			table.innerHTML += "<tr id='" + active + "-hyperlink'><th> BST </th><th> HP </th><th> Atk </th><th> Def </th><th> SpA </th><th> SpD </th><th> Spe </th><th> Copy </th></tr>";
				
			for(let j=0; j < this.content[active].length; j++)
			{
				spread = this.content[active][j];

				table.innerHTML += "<tr>" +
				"<td> " + active + " <div class='ev-subtitle'> Stats </div></td>" + 
				"<td> " + spread.evs[0] + " <div class='ev-subtitle'> " + spread.stats[0] + "</div></td>" + 
				"<td> " + spread.evs[1] + " <div class='ev-subtitle'> " + spread.stats[1] + "</div></td>" + 
				"<td> " + spread.evs[2] + " <div class='ev-subtitle'> " + spread.stats[2] + "</div></td>" + 
				"<td> " + spread.evs[3] + " <div class='ev-subtitle'> " + spread.stats[3] + "</div></td>" + 
				"<td> " + spread.evs[4] + " <div class='ev-subtitle'> " + spread.stats[4] + "</div></td>" + 
				"<td> " + spread.evs[5] + " <div class='ev-subtitle'> " + spread.stats[5] + "</div></td>" + 
				"<td> <a href='#' onClick=''> EVs Only </a></br>" + 
				"<a href='#' onClick=''> Full Set </a> </td>" + 
				"</tr>";
			}
			
			tgl.innerHTML = '[Hide]';
		}
		else
		{
			table.innerHTML = '';
			tgl.innerHTML = '[Show]';
		}
	}
}