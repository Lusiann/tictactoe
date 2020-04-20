const celle = document.querySelectorAll('[data-position]')

const contenitoreTris = document.querySelector('#display')
const bottoneRestart = document.querySelector('#restart')
bottoneRestart.addEventListener('click',restart)
let win = {winStatus:false,whoWon:'',PlayerWinnerName:''}





const board = ['','','','','','','','','']

const Player = function (name, mark) {
    return {name,mark}
}


const player1 = Player('ludovico','X')
const player2 = Player('qualcuno','O')

let currentPlayer = player1


//fa giocatori??? va dentro game controller per non farlo cambiare
const GameBoard = () => {
    
}



function startGame() {
    celle.forEach((cella) => {
        cella.addEventListener('click',move,{once: true})
    })

}

function restart() {
    win.winStatus = false
    board.forEach((index,i) => {
        board[i] = '' ;
        celle[i].classList.remove(player1.mark)
        celle[i].classList.remove(player2.mark)
    })
    startGame() 
    
}

function switchCurrentPlayer () {
    
    if (currentPlayer === player1) {
        currentPlayer = player2
    } else {
        currentPlayer = player1
    }
}




function render() {
    
    board.forEach( (block,i) => {
        if(block != '') {
            celle[i].classList.add(block) 
        }
              
    })
}
function move(e) {
    if(win.winStatus) return;        
        
    console.log(e.target.dataset.position)
   
    WriteOnTheArrayBoard(e)
    
    render()
    if (isWinner(currentPlayer)) {
        win.winStatus = true
        win.whoWon = currentPlayer.mark
        win.PlayerWinnerName = currentPlayer.name
        
        
    }
    switchCurrentPlayer()
    displayCurrentPlayer()
    
    
    
    


}

const winningCombinations =  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function isWinner(currentPlayer) {
    
    
    return winningCombinations.some(combination => {
        
        return combination.every(index => {
            
            return celle[index].classList.contains(currentPlayer.mark)
        })
    })

    
    
    
}

function displayCurrentPlayer() {
    if (win.winStatus) {
        contenitoreTris.textContent = `il giocatore ${win.PlayerWinnerName} con ${win.whoWon} ha vinto`
    } else {
        contenitoreTris.textContent = `è il turno di ${currentPlayer.name} con ${currentPlayer.mark}`
    }
    
}

function WriteOnTheArrayBoard (e) {
    const position = e.target.dataset.position
    board[position] = currentPlayer.mark

}

restart()







render()




