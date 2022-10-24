import {pageBuilder,genGame} from './modules/pageBuilder.js'
import {getMoveableCells} from './modules/gameController.js'

// Contains field size

let gameMode =  '4x4'
if(localStorage.getItem('Game')){
	gameMode = JSON.parse(localStorage.getItem('Game')).mode; 
}
let isGameSaving = false;
let isGameStarted = false;
let isGameRestarting = false;
let minutes =  JSON.parse(localStorage.getItem('Game')) ? JSON.parse(localStorage.getItem('Game')).minutes : '00';
let seconds =  JSON.parse(localStorage.getItem('Game')) ? JSON.parse(localStorage.getItem('Game')).seconds : '00';


let timer = new Date('December 17, 1995  00:'+ minutes+':'+seconds);

let Moves =  JSON.parse(localStorage.getItem('Game')) ? JSON.parse(localStorage.getItem('Game')).moves : 0;




pageBuilder(gameMode);
let movableCells = getMoveableCells(gameMode);
const gameArea = document.querySelector('.game-area')
gameArea.addEventListener('click', moveCell);

const modes = document.querySelectorAll('.mode-select');
const timeElement = document.querySelector('.time');
const userControls = document.querySelector('.user-controls');
const movesDisplay = document.querySelector('.moves');
const soundBtn = document.querySelector('.soundBlock');
const soundRod = document.querySelector('.rod')
const frameInfo = document.querySelector('.frame-info')

movesDisplay.textContent = Moves;

let clickedCell;
let emptyCell;
let puzzles = document.querySelectorAll('.puzzle-piece');

for (const puzzle of puzzles) {
	puzzle.addEventListener('animationstart', animStart)
	puzzle.addEventListener('animationend', animEnd)
}



const moveSound = new Audio('./assets/sound/click_002.ogg')
moveSound.volume = 0.1;

soundBtn.addEventListener('click', (event) =>{
	soundRod.classList.toggle('display-block');
	if(moveSound.volume === 0){
		moveSound.volume = 0.1;	
	} else{
		moveSound.volume = 0;
	}
})

for (const modeSelector of modes) {
	modeSelector.addEventListener('click',setGameMode);
}
// Change current gameMode
function setGameMode(event){
	event.preventDefault();
	const selectedMode = event.target.textContent;
	gameMode = selectedMode;
	
	timeElement.textContent = '00:00'
	
	genGame(gameMode, true);
	nullifyMoves();
	frameInfo.children[0].childNodes[1].textContent = gameMode; 
	
	


}

userControls.children[0].addEventListener('click',shuffleAndStart);
// Restart game
function shuffleAndStart(){
	genGame(gameMode,true);

	timeElement.textContent = '00:00'
	nullifyMoves()
}

function nullifyMoves(){
	Moves = 0;
	movesDisplay.textContent = Moves;

	minutes = '00';
	seconds = '00';
	timer = new Date('December 17, 1995  00:'+ minutes+':'+seconds);

	puzzles = document.querySelectorAll('.puzzle-piece');
	for (const puzzle of puzzles) {
		puzzle.addEventListener('animationstart', animStart)
		puzzle.addEventListener('animationend', animEnd)
	}
	isGameStarted = false;
}

function getSavedGame(){
	let numberOrder = [];

	let nullCounter = 0;
	for (const cell of gameArea.children) {
		if(nullCounter > 1){
			numberOrder = null;
			break;
		}
		if(cell.children[0]){
			numberOrder.push(cell.children[0].textContent)
		}else {
			numberOrder.push(null);
			nullCounter++;
		} 
	}

	return {
		mode: gameMode,
		minutes: minutes,
		seconds: seconds,
		moves: Moves,
		numOrder: numberOrder
	}
}

function setLocalStorage(){
	localStorage.setItem('Game', JSON.stringify(getSavedGame()));
}
window.addEventListener('beforeunload',setLocalStorage);

function getLocalStorage(){	
	let storage = JSON.parse(localStorage.getItem('Game'))
	timeElement.textContent = `${storage.minutes.toString().padStart(2,0)}:${storage.seconds.toString().padStart(2,0)}`
}
window.addEventListener('load',getLocalStorage);

let timerStarted = false;
// SetTimer to 00:00 and start
function startTimer(){
	if(timerStarted) return;
	count();
	function count(){
		setTimeout(() => {
			if(isGameSaving || !isGameStarted){
				timerStarted = false;
				return;
			} 
			
			timer.setSeconds(timer.getSeconds()+1);
			minutes = timer.getMinutes();
			seconds = timer.getSeconds();
			if(timer.getHours() === 0){
				timeElement.textContent =  `${timer.getMinutes().toString().padStart(2,0)}:${timer.getSeconds().toString().padStart(2,0)}`
			}		
			
			timerStarted = true;
			count()
		}, 1000);
	}
}


function animStart(event){

	event.target.parentElement.style.overflow = 'visible';
	gameArea.removeEventListener('click', moveCell);

}

function animEnd(event){


	event.target.parentElement.style.overflow = 'hidden';
	emptyCell.appendChild(clickedCell);
	movableCells = getMoveableCells(gameMode)
	event.target.className = 'puzzle-piece';	
	gameArea.addEventListener('click', moveCell);
	
	if(isSolved()) win();

}


// Moving cell fun
function moveCell(event){	
	if(!isGameStarted || isGameSaving){
		startTimer();
		isGameStarted = true;
		isGameRestarting = false;
		isGameSaving = false;
	} 

	const cells = document.querySelectorAll('.cell');
	let emptyCellIndex = -1;

	for (const cell of cells) {
			emptyCellIndex++;
			if(cell.children.length === 0){
				emptyCell = cell;
				break;
			} 		
		}

	
	let cellPosition;
	if(event.target.classList.contains('puzzle-piece')){
		clickedCell = event.target;
	} else return;
	
	// Getting position of clicked cell
	for (const direction in movableCells) {
		if(movableCells[direction]){
			if(movableCells[direction].children[0] === clickedCell){
				cellPosition = direction;
			}
		}		
	}
	
	if(!cellPosition) return;

	
	if(cellPosition === 'right'){
		clickedCell.classList.add('moveRight')
	} else if(cellPosition === 'left'){		
		clickedCell.classList.add('moveLeft')	
	} else if(cellPosition === 'top'){
		clickedCell.classList.add('moveBottom')	
	} else if(cellPosition === 'bottom'){			
		clickedCell.classList.add('moveTop')
	}

	Moves++;
	movesDisplay.textContent = Moves;

	moveSound.play();

	
} 

function win(){
	alert(`Hooray! You solved the puzzle in ${timer.getMinutes()}:${timer.getSeconds()} and ${Moves} moves!`);
	isGameSaving = true;

	let Results = localStorage.getItem('Results');
	const WonGame = getSavedGame();

	let resultsToParse;
	if(Results){
		resultsToParse = JSON.parse(Results);
		resultsToParse.push(WonGame);

		resultsToParse.sort((a,b) =>{
			if(a.mode !== b.mode){
				if(Number(a.mode.split('x')[0]) > Number(b.mode.split('x')[0])){
					return -1;
				}
			}

			if(a.moves > b.moves){
				return 1;
			}

			if(a.moves < b.moves){
				return -1;
			}

			if(a.moves === b.moves){
				if((a.minutes*60+a.seconds) < (b.minutes*60+b.seconds)){
					return -1;
				}
				else return 1;	
			}
		})

		if(resultsToParse.length>10){
			while(resultsToParse.length>10){
				resultsToParse.pop();
			}
		}

		localStorage.setItem('Results', JSON.stringify(resultsToParse))
	}
	else{
		resultsToParse = [];
		resultsToParse.push(WonGame);
		localStorage.setItem('Results', JSON.stringify(resultsToParse))
	}

	isGameSaving = true;
	shuffleAndStart();

}

function isSolved(){
	const cells = gameArea.children;

	for (let i = 0; i < cells.length-1; i++) {
		if(cells[i].children.length === 0) return false;
		if(Number(cells[i].children[0].textContent)-1 !== i) return false;	
	}

	return true;
}


const cross = document.querySelector('.close');
const openResults = document.querySelector('.btn-results');
const resultsWindow = document.querySelector('.results');
const resultsItems = document.querySelector('.result-items');
const shadowing = document.querySelector('.shadowing');


shadowing.addEventListener('click', (event)=>{
	if(event.target === shadowing){
		resultsWindow.classList.remove('display-flex');
	shadowing.classList.remove('display-block');
	}
})

openResults.addEventListener('click', showResults);
function showResults(){
	isGameSaving = true;
	resultsItems.textContent = '';
	resultsWindow.classList.add('display-flex');
	shadowing.classList.add('display-block');

	let resultData;
	if(localStorage.getItem('Results')){
		resultData = JSON.parse(localStorage.getItem('Results'));
	}

	for (let i = 0; i < resultData.length; i++) {
		const gameInfo = resultData[i];
		const resultItem = document.createElement('div');
		const number = document.createElement('div');
		const moves = document.createElement('div');
		const time = document.createElement('div');
		const mode = document.createElement('div');

		resultItem.classList.add('result-item');
		number.classList.add('number');
		moves.classList.add('moves');
		time.classList.add('time');
		mode.classList.add('mode');

		number.textContent = i+1+'.';
		mode.textContent = gameInfo.mode;
		moves.textContent = gameInfo.moves;
		time.textContent = `${gameInfo.minutes.toString().padStart(2,0)}:${gameInfo.seconds.toString().padStart(2,0)}`;

		resultItem.appendChild(number);
		resultItem.appendChild(mode);
		resultItem.appendChild(moves);
		resultItem.appendChild(time);

		resultsItems.appendChild(resultItem);
	
	}
	
}

cross.addEventListener('click', () =>{
	resultsWindow.classList.remove('display-flex');
	shadowing.classList.remove('display-block');
})





