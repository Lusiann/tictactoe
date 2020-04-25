const celle = document.querySelectorAll('[data-position]')
const bottoneSelezionaNome = document.getElementById('settings')
const contenitoreTris = document.querySelector('#display')
const bottoneRestart = document.querySelector('#restart')
const formNomi = document.querySelector('.selezionaNome')
const audio = document.getElementById('myAudio')


bottoneSelezionaNome.addEventListener('click',function() {
    formNomi.classList.toggle('active')
})

const Player = function (name, mark) {
    return {name,mark}
}





//fa giocatori??? va dentro game controller per non farlo cambiare
const GameBoard = (() => {

    let player1 = Player('Player1','X')
    let player2 = Player('Player2','O')

    let currentPlayer = player1

    bottoneRestart.addEventListener('click',restart)
    formNomi.addEventListener('submit',createPlayer)
    formNomi.addEventListener('change',restart)
    let win = {winStatus:false,whoWon:'',PlayerWinnerName:'',tie:false,serieVittoria:''}
    
    const board = ['','','','','','','','','']

    //activate the eventlisteners on each div and if clicked deactivate it with once:true
    function startGame() {
        celle.forEach((cella) => {
            cella.addEventListener('click',handleclick,{once: true})
        })
    
    }

    //make player 2 make a random move
    function playAgainstCpuRandom() {
    
        if(checkTie()) return
        const number = Math.floor(Math.random() * 9)
        if(board[number] === '') {
            move(number)
        } else {
            playAgainstCpuRandom()
        }
        
        render()
    
        
    
    }
    //the minimax function I basically copied it from the coding train video and added a parameter to dumb down the cpu
    function bestMoveCpu (isRandom) {        
        let bestMove
        let bestScore = -Infinity
        board.forEach((block,i) => {
            if(block === '') {
                board[i] = player2.mark
                let score = minmax(board,0,false,isRandom)
                board[i] = ''
                if (score > bestScore){
                    bestScore = score
                    bestMove = i
                } 
            }
        })
        
        if(bestMove === undefined) {
            playAgainstCpuRandom()
        } else {
            move(bestMove)
        }        
        render()
    }

    function minmax(board,depth,isMaximizing,isRandom) {
        
        if(isWinner(player1)) {
            return -10
        } else if (isWinner(player2)) {
            return 10
        } else if (checkTie()) {
            return 0
        }
        
        if(isRandom) return
        
        if(isMaximizing) {
            let bestScore = -Infinity
            board.forEach((block,i) => {
                if(block === '') {
                    board[i] = player2.mark
                    let score = minmax(board, depth + 1, false)
                    board[i] = ''
                    bestScore = Math.max(score, bestScore) 
                }
            })
            return bestScore

        } else {
            let bestScore = Infinity
            board.forEach((block,i) => {
                if(block === '') {
                    board[i] = player1.mark
                    let score = minmax(board, depth + 1, true)
                    board[i] = ''
                    bestScore = Math.min(score, bestScore)
                }
            })
            return bestScore
        }
       

        
    }
    
    //change the player default name
    function createPlayer (e) {
        e.preventDefault()
        
        player1 = Player(this[0].value,'X')
        player2 = Player(this[1].value,'O')
        currentPlayer = player1    
        restart()
    
    }
    //based on the form submission change the player who starts
    function whoGoesFirst() {
        let twoOrOne
        if(formNomi[2].value === 'player1') twoOrOne = 1
        else if(formNomi[2].value === 'player2') twoOrOne = 2
        else if(formNomi[2].value === 'random') twoOrOne = (Math.floor(Math.random() * 2 + 1))
            
        if(twoOrOne === 1) currentPlayer = player1
        else if(twoOrOne === 2)currentPlayer = player2
        contenitoreTris.innerHTML = `<strong>${currentPlayer.name}</strong> with <strong>${currentPlayer.mark}</strong>  starts`  
    
    }    
    
    //cleans basically everything
    function restart() {
        win.winStatus = false
        win.tie = false       
        board.forEach((index,i) => {
            board[i] = '' ;
            celle[i].classList.remove(player1.mark)
            celle[i].classList.remove('winner')
            celle[i].classList.remove('tie')            
            celle[i].classList.remove(player2.mark)
        })
        //if player 2 is selected as first at restart he make the move        
        whoGoesFirst()
        if (formNomi[3].value === 'randomlol' && currentPlayer === player2) playAgainstCpuRandom()        
        if (formNomi[3].value === 'minmax' && currentPlayer === player2) bestMoveCpu()
        if (formNomi[3].value === 'minmaxRandom' && currentPlayer === player2) bestMoveCpu(isRandom = true)
        startGame() 
        
    }
    //handles the click of the user and if a against cpu is selected player2 make a move
    function handleclick(e) {        
        
        move(e.target.dataset.position)
        if (formNomi[3].value === 'minmax') bestMoveCpu()
        if (formNomi[3].value === 'randomlol') playAgainstCpuRandom()
        if (formNomi[3].value === 'minmaxRandom') bestMoveCpu(isRandom = true)
        
        

    }
    
    //each turn the current player switches with the other player
    function switchCurrentPlayer () {
        
        if (currentPlayer === player1) {
            currentPlayer = player2
        } else {
            currentPlayer = player1
        }
    }
    //writes on the array board based on a input number
    function WriteOnTheArrayBoard (number) {
        const position = number
        board[position] = currentPlayer.mark
    
    }

    //does a move based on a input number
    function move(number) {
        if(win.winStatus || win.tie) return;           
              
        WriteOnTheArrayBoard(number)
        
        render()
        if (isWinner(currentPlayer)) {
            if (currentPlayer === player2 && formNomi[3].value === 'randomlol') {
                audio.play()
            }
            win.winStatus = true
            win.whoWon = currentPlayer.mark
            win.PlayerWinnerName = currentPlayer.name
            win.serieVittoria.forEach(index => {
                celle[index].classList.add('winner')
            })
            
                      
        } else {
            if (checkTie()) {
                win.tie = true
                celle.forEach(cella => {
                    cella.classList.add('tie')
                    
                })
            
            }
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
    //check if a player has won and return the winning combination
    function isWinner(currentPlayer) {
                                         
        
        return winningCombinations.some((combination) => { 
                                
            let vittoria = combination.every(index => {
                               
                return board[index] === currentPlayer.mark
            })
            if (vittoria) {
                win.serieVittoria = combination
            }
            return vittoria
            
            
        })      
        
    }

    //check if all the blocks are clean if not there is a tie
    function checkTie() {
        
        if(board.every(blocco => {
            return blocco !== ''
        })) return true
        else return false
    }




    
    
        //add the classlist to the block to display the current player mark
    function render() {
    
        board.forEach( (block,i) => {
            if(block != '') {
                celle[i].classList.add(block) 
            }
                  
        })
    }
        
        //renders the player turn and the status of the game
    function displayCurrentPlayer() {
        if (win.winStatus) {
            contenitoreTris.innerHTML = `Player <strong>${win.PlayerWinnerName}</strong> with <strong>${win.whoWon}</strong> has won`
        } else if(win.tie) {
            contenitoreTris.innerHTML = 'Tie'            
        } else {
            contenitoreTris.innerHTML = `It's the turn of <strong>${currentPlayer.name}</strong> with <strong>${currentPlayer.mark}</strong>`
        }
            
    }
    
    startGame()
    render()
    


}) ()








 
















