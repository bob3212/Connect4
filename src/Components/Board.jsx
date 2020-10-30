import React, {Component} from 'react';
import Row from './Row';
import Chat from './Chat';
import io from 'socket.io-client'

export default class Board extends Component{

    constructor(props){
        super(props);
        this.state = {
            // player1: 1,
            // player2: 2,
            gameOver: false,
            //gameId: "",
            currentPlayer: null,
            board: [],
            messages: [],
            socket: io({query: `game=${this.props.match.params.id}`})
        }
        this.play = this.play.bind(this)
        this.state.socket.on('message', msg => {
            console.log(msg)
            this.setState({messages: [...this.state.messages, msg]})
        }) 
        this.sendMessage = message => {
            this.state.socket.emit("message", message)
        }
    }
    //Initialize the empty board
    initBoard(){
        let board=[];
        for(let row=0; row<6; row++){
            let row=[];
            for(let col=0; col<7; col++){
                row.push(null);
            }
            board.push(row);
        }

        this.setState({
            board,
            currentPlayer: this.props.player1,
            gameOver: false
        })

    }

    play(column){
        //check if valid move :)
        if(!this.state.gameOver){
            let board = this.state.board;
            for(let i=5; i>=0; i--){
                if(board[i][column] === null){
                    board[i][column] = this.state.currentPlayer;
                    break;
                }
            }
            let result = this.checkGameEnded(board);
            if(result === null){
                this.setState({
                    board, 
                    currentPlayer: this.switchPlayer()
                })
            }else if(result === this.props.player1){
                this.setState({
                    board,
                    gameOver: true
                })
                alert("Player One Wins");
            }else if(result === this.props.player2){
                this.setState({
                    board,
                    gameOver: true
                })
                alert("Player Two Wins");
            }else{
                this.setState({
                    board,
                    gameOver: true
                })
                alert("This Game has ended in a draw");
            }
        }else{
            alert("Game over!")
        }
    }
    checkHorizontal(board){
        for(let r=0; r<6; r++){
            for(let c=0; c<4; c++){
                if(board[r][c]){
                    if(board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2] && board[r][c] === board[r][c+3]){
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkVertical(board){
        for(let r=0; r<3; r++){
            for(let c=0; c<7; c++){
                if(board[r][c]){
                    if(board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c] && board[r][c] === board[r+3][c]){
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkFirstDiagonal(board){
        for(let r=0; r<3; r++){
            for(let c=0; c<4; c++){
                if(board[r][c]){
                    if(board[r][c] === board[r+1][c+1] && board[r][c] === board[r+2][c+2] && board[r][c] === board[r+3][c+3]){
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkSecondDiagonal(board){
        for(let r=3; r<6; r++){
            for(let c=0; c<4; c++){
                if(board[r][c]){
                    if(board[r][c] === board[r-1][c+1] && board[r][c] === board[r-2][c+2] && board[r][c] === board[r-3][c+3]){
                        return board[r][c];
                    }
                }
            }
        }
    }

    checkDraw(board){
        for(let r=0; r<6; r++){
            for(let c=0; c<7; c++){
                if(!board[r][c]){
                    return null;
                }
            }
        }
        return "draw";
    }

    checkGameEnded(board){
        return this.checkHorizontal(board) || this.checkVertical(board) || this.checkFirstDiagonal(board) || this.checkSecondDiagonal(board) || this.checkDraw(board);
    }

    //Switches the current player 
    switchPlayer(){
        return (this.state.currentPlayer === this.props.player1) ? this.props.player2 : this.props.player1;
    }

    forfeitGame(){
        this.setState({
            gameOver: true
        })
        alert("Player has forfeited the game")
    }

    componentWillMount(){
        this.initBoard()
    }

    render(){
        return (
            <div>
                <h1>Game Against: Mark</h1>
                <div className="button" onClick={()=>this.initBoard()}>New Game</div>
                <table>
                    <thead>
                        <tbody>
                            {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
                        </tbody>
                    </thead>
                </table>
                <div className="forfeit-button" onClick={()=>this.forfeitGame()}>Forfeit</div>
                <Chat messages={this.state.messages} sendMessage={this.sendMessage}/>
                
            </div>
        )
    }
}