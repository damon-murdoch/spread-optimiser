class Tree 
{
	constructor()
	{
		this.children = {};
		this.bst = null;
	}

	insert(item)
	{
		if(item.length)
		{
			let i = item.shift();
			
			if(!this.children[i])
			{
				this.children[i] = new Tree();
			}	
			
			this.children[i].insert(item);
		}
	}
	
	find(item)
	{
		if(item.length)
		{
			let i = item.shift();

			if (Object.keys(this.children).includes(i.toString()))
			{
				return this.children[i].find(item);
			}
			else
			{
				return false;
			}
		}
		else
		{
			return true;
		}
	}
}