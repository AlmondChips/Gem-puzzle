import {genGame} from './gameController.js';

export {genGame};
export function pageBuilder(mode,options){
	let size = mode || '4x4';
	
	// Logotype
	const gameBlock = document.createElement('div');
	gameBlock.classList.add('game-block','wrapper');
	const game_logo = document.createElement('div');
	game_logo.classList.add('game-logo');
	game_logo.appendChild(document.createElement('h1'));
	game_logo.children[0].textContent = 'Gem Puzzle'
	
	gameBlock.appendChild(game_logo);
	// Buttons, user-controls
	const menu = document.createElement('div');
	menu.classList.add('menu');
	const userControls = document.createElement('div');
	userControls.classList.add('user-controls');
	const btn1 = document.createElement('a');
	const btn3 = document.createElement('a');
	btn1.classList.add('btn');
	btn3.classList.add('btn','btn-results');
	btn1.textContent = 'Shuffle and Start';
	btn3.textContent = 'Results';
	const soundBtn = document.createElement('img');
	soundBtn.classList.add('sound-btn');
	soundBtn.src = './assets/images/audio.svg'
	userControls.appendChild(btn1);
	userControls.appendChild(btn3);

	menu.appendChild(userControls);
	
	// Game info
	const gameInfo = document.createElement('div');
	gameInfo.classList.add('game-info')
	const moves = document.createElement('p');
	const spanMoves = document.createElement('span');
	spanMoves.classList.add('moves');
	spanMoves.textContent = 0;
	moves.textContent = 'Moves: ';
	moves.appendChild(spanMoves);
	gameInfo.appendChild(moves);
	const time = document.createElement('p');
	const spanTime = document.createElement('span');
	spanTime.classList.add('time');
	spanTime.textContent = '00:00'
	time.textContent = 'Time: '
	time.appendChild(spanTime);
	gameInfo.appendChild(time);
	menu.appendChild(gameInfo);
	gameBlock.appendChild(menu);

	const soundBlock = document.createElement('div');
	soundBlock.classList.add('soundBlock');
	const soundRod = document.createElement('div');
	soundRod.classList.add('rod');
	soundBlock.appendChild(soundBtn);
	soundBlock.appendChild(soundRod);
	gameInfo.appendChild(soundBlock);
	
	
	// Generate game Area
	const gameArea = document.createElement('div');
	gameArea.classList.add('game-area',size);
	gameBlock.appendChild(gameArea);
	document.querySelector('body').appendChild(gameBlock);
	genGame(size);
	
	const frameInfo = document.createElement('div')
	frameInfo.classList.add('frame-info');
	frameInfo.innerHTML = `<p>Frame size: <span>${size}</span></p>`;
	
	document.querySelector('.game-block').appendChild(frameInfo);
	
	// Mode togglers
	const modeSelection = document.createElement('div');
	modeSelection.classList.add('mode-selection');
	modeSelection.innerHTML = `<p>Other sizes: 
	<span><a class="mode-select" href="">3x3</a></span>
	<span><a class="mode-select" href="">4x4</a></span>
	<span><a class="mode-select" href="">5x5</a></span>
	<span><a class="mode-select" href="">6x6</a></span>
	<span><a class="mode-select" href="">7x7</a></span>
	<span><a class="mode-select" href="">8x8</a></span>
	</p>`;	

	document.querySelector('.game-block').appendChild(modeSelection)

const resultsWindow = document.createElement('div');
resultsWindow.classList.add('results');
resultsWindow.innerHTML = `<div class="close"><img src="./assets/images/closeBtn.png" alt="Cross"></div>
<h2>Top 10 results</h2>
<div class="results-header">
	<div>№</div>
	<div>Mode</div>
	<div>Moves</div>
	<div>Time</div>
</div>
<div class="result-items">			
</div>`

	document.querySelector('body').appendChild(resultsWindow);

	const shadowing = document.createElement('div');

	shadowing.classList.add('shadowing');

	document.querySelector('body').appendChild(shadowing);
}