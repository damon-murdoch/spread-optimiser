/*
	Description: 
		Maths function for calculating the real value of a Pokemon's
		individual stat	for all fields excluding hit points, which is calculated
		by the hp() function.
	
	Parameters:	
		B: Species Base Stat
		I: Stat Individual Value (IV)
		E: Stat Effort Value (EV)
		L: Pokemon Level
		N: Pokemon Nature boost (0.9 - reducing, 1.0 - neutral, 1.1 - boosting)
		
	Notes:
		Author: Damon Murdoch, based on Bulbapedia's conversion formula
		Date: 21/11/2019
*/
function stat(B,I,E,L,N)
{
	// console.log(B + ' ' + I + ' ' + E + ' ' + L + ' ' + N);
	return Math.floor(((Math.floor(I + 2 * B + (E/4)) * L / 100) + 5) * N);
}

/*
	Description: 
		Maths function for calculating the real value of a Pokemon's hit point
		(hp) stat. Other fields are calculated using the stat() function.
		
	Parameters:	
		B: Species Base Stat
		I: Stat Individual Value (IV)
		E: Stat Effort Value (EV)
		L: Pokemon Level
		
	Notes:
		Author: Damon Murdoch, based on Bulbapedia's conversion formula
		Date: 21/11/2019
*/
function hp(B,I,E,L)
{
	// console.log(B + ' ' + I + ' ' + E + ' ' + L);
	return Math.floor(((I + 2 * B + (E / 4)) * L / 100) + 10 + L);
}

function total(B,I,E,L,N)
{
	s = []
	
	s.push(hp(B[0],I[0],E[0],L));
	
	for(i=1; i<B.length;i++)
	{
		s.push(stat(B[i],I[i],E[i],L,N[i]));
	}
	
	
	
	return s;
}