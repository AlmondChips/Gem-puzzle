 // Generate game field
 export function genGame(mode,isNewGame){
	const modeArgs = mode.split('x');
	const elementsQuantity = modeArgs[0]*modeArgs[1];
	const gameArea = document.querySelector('.game-area');
	gameArea.textContent = ''
	gameArea.className = '';
	gameArea.classList.add('game-area','mode_'+mode);
	

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	
	let whileCounter = 0;
	let isNotEven = true;
	
	// Fill empty cells by cells with randomly taken numbers

	let numbers = [];
	for (let i = 1; i < elementsQuantity; i++) {
		const number = {num: i, used: false};
		numbers.push(number)	
	}

	// Fill with empty cells
	for (let i = 0; i < elementsQuantity; i++) {
		const cell = document.createElement('div');
		cell.classList.add('cell');
		gameArea.appendChild(cell);
	}


	if(localStorage.getItem('Game') &&  JSON.parse(localStorage.getItem('Game')).numOrder && !isNewGame){
		let options = JSON.parse(localStorage.getItem('Game'));
		let pointer = 0;
		for (const cell of gameArea.children) {
			if(options.numOrder[pointer]){
				const puzzlePiece = document.createElement('div');
				puzzlePiece.classList.add('puzzle-piece');
				puzzlePiece.textContent = options.numOrder[pointer];
				cell.appendChild(puzzlePiece);
				pointer++;
			}
			else{
				pointer++;
			}				
		}	
		
	} else
	{
		while(isNotEven){
			let oddOrEven = 0;
			whileCounter = 0;
			gameArea.textContent = '';
				// Fill the object by numbers that will be used to generate random cells
				let numbers = [];
				for (let i = 1; i < elementsQuantity; i++) {
					const number = {num: i, used: false};
					numbers.push(number)	
				}

				// Fill with empty cells
				for (let i = 0; i < elementsQuantity; i++) {
					const cell = document.createElement('div');
					cell.classList.add('cell');
					gameArea.appendChild(cell);
				}
			while (whileCounter <elementsQuantity-1) {
			

				const rndNum = getRandomInt(0,elementsQuantity-1);
				if(!numbers[rndNum].used){	
					const puzzlePiece = document.createElement('div');
					puzzlePiece.classList.add('puzzle-piece');
					puzzlePiece.textContent = numbers[rndNum].num;
					gameArea.children[whileCounter].appendChild(puzzlePiece);
					numbers[rndNum].used = true;
					whileCounter++;
				}
			}

			

			// for (let i = 0; i < elementsQuantity-Number(modeArgs[0])+1; i+=Number(modeArgs[0])) {
			// 	for (let j = 0; j < modeArgs[0]-1; j++) {					
			// 		let current = gameArea.children[i+j].children[0].textContent;
					
			// 		for (let x = j+1; x < modeArgs[0]; x++) {
			// 			if(gameArea.children[x+i].children.length === 0) continue;
			// 			let chekedElement = gameArea.children[x+i].children[0].textContent;

			// 			if(chekedElement< current) oddOrEven++;
						
			// 		}
			// 	}
				
			// }

			for (let i = 0; i < elementsQuantity-2; i++) {
					let current = gameArea.children[i].children[0].textContent;					
					for (let x = i+1; x < elementsQuantity-1; x++) {
						if(gameArea.children[x].children.length === 0) continue;
						let chekedElement = gameArea.children[x].children[0].textContent;

						if(Number(chekedElement)< Number(current)) oddOrEven++;
						
					}					
			}

			if(Number(modeArgs[0])%2 !== 0){
				if (((oddOrEven+Number(modeArgs[0])) % 2) !== 0) isNotEven = false;
			}
			else{
				if (((oddOrEven+Number(modeArgs[0])) % 2) === 0) isNotEven = false;
			}
		
			console.log(oddOrEven+Number(modeArgs[0]) % 2);
		}
		
	}	
	getMoveableCells(mode)
}

let moveableCells = {
	top: null,
	right: null,
	bottom: null,
	left: null,
}

export function getMoveableCells(mode){
	const modeArgs = mode.split('x');
	const gridRatio = Number(modeArgs[0]);
	
	const cells = document.querySelectorAll('.cell');
	let emptyCell;
	let emptyCellIndex = -1;
	// Get empty cell
	for (const cell of cells) {
		emptyCellIndex++;
		if(cell.children.length === 0){
			emptyCell = cell;
			break;
		} 
		
	}


	// Check for the top cell
	if(emptyCellIndex+1-gridRatio > 0){
		moveableCells.top = cells[emptyCellIndex-gridRatio];
	}else moveableCells.top = null;

	// Check for the bottom cell
	if(emptyCellIndex+1+gridRatio < cells.length+1){
		moveableCells.bottom = cells[emptyCellIndex+gridRatio];
	}else moveableCells.bottom = null;

	// Check for the right cell
	if((emptyCellIndex+1) % gridRatio !== 0){
		moveableCells.right = cells[emptyCellIndex+1];
	} else moveableCells.right = null;

	// Check for the left cell
	if(emptyCellIndex % gridRatio !==0){
		moveableCells.left = cells[emptyCellIndex-1];
	} else moveableCells.left = null;


	return moveableCells;
}