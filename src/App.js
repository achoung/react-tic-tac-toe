import React, { PureComponent } from 'react';
import './App.css';

// constants
const BOARD_SIZE = 3;
const TOTAL_NUM_OF_BOARD_CELLS = BOARD_SIZE * BOARD_SIZE;
const PLAYER_X = 'X';
const PLAYER_O = 'O';

class App extends PureComponent {
    
    state = {
        board: {},
        isGameOver: false,
        playerTurn: PLAYER_X,
        numOfTurns: 0,
    };

    constructor() {
        super();
        this.state.board = this.initializeBoard();
    }

    initializeBoard() {
        const board = {};
        for(let i=0; i<BOARD_SIZE; i++) {
            board[i] = {};
            for(let j=0; j<BOARD_SIZE; j++) {
                board[i][j] = '';
            }
        }
        return board;
    }

    hasPlayerWonHorizontally(board) {
        let playerWon = null;
        
        // check horizontally
        for (let row in board) {
            let xPlayerCheckHorizontal = 0;
            let oPlayerCheckHorizontal = 0;

            for (let col in board[row]) {
                if (board[row][col] === PLAYER_X) {
                    xPlayerCheckHorizontal++;
                } else if (board[row][col] === PLAYER_O) {
                    oPlayerCheckHorizontal++;
                }
            }

            if (xPlayerCheckHorizontal === BOARD_SIZE) {
                playerWon = PLAYER_X;
                break;
            }

            if (oPlayerCheckHorizontal === BOARD_SIZE) {
                playerWon = PLAYER_O;
                break;
            }
        }

        return playerWon;
    }

    hasPlayerWonVertically(board) {
        let playerWon = null;
        
        return playerWon;
    }

    hasPlayerWonDiag(board) {
        let playerWon = null;
        
        // check diagonal (from top-left to bottom-right)
        let xPlayerDiag = 0;
        let oPlayerDiag = 0;
        for (let i=0; i<BOARD_SIZE; i++) {
            if (board[i][i] === PLAYER_X) {
                xPlayerDiag++;
            } else if (board[i][i] === PLAYER_O) {
                oPlayerDiag++;
            }
        }

        if (xPlayerDiag === BOARD_SIZE) {
            playerWon = PLAYER_X;
        } else if (oPlayerDiag === BOARD_SIZE) {
            playerWon = PLAYER_O;
        }

        return playerWon;
    }

    /**
     * @returns {String | null} The player that has won or null if neither player has won
     */
    hasPlayerWon(board) {
        let playerWon = null;
        
        const hasPlayerWonHorizontally = this.hasPlayerWonHorizontally(board);
        const hasPlayerWonVertically = this.hasPlayerWonVertically(board);
        const hasPlayerWonDiag = this.hasPlayerWonDiag(board);

        // TODO: Add check for vertical and anti-diagonal (top-right to bottom-left)



        return hasPlayerWonHorizontally || hasPlayerWonVertically || hasPlayerWonDiag;
    }

    onCellClick(row, col) {
        const { board, numOfTurns, playerTurn } = this.state;

        if (board[row][col] === '') {
            const updatedBoard = JSON.parse(JSON.stringify(board));
            updatedBoard[row][col] = playerTurn;
            const nextNumOfTurns = numOfTurns + 1;

            const hasPlayerWon = this.hasPlayerWon(updatedBoard);

            if (hasPlayerWon) {
                this.setState({
                    board: updatedBoard,
                    isGameOver: true,
                    numOfTurns: nextNumOfTurns,
                    playerWon: hasPlayerWon,
                });
            } else if (nextNumOfTurns === TOTAL_NUM_OF_BOARD_CELLS) {
                this.setState({
                    board: updatedBoard,
                    isGameOver: true,
                    numOfTurns: nextNumOfTurns,
                    playerTurn: null,
                    playerWon: null,
                });
            } else {
                const nextPlayerTurn = (playerTurn === PLAYER_X) ? PLAYER_O : PLAYER_X;
                this.setState({
                    board: updatedBoard,
                    numOfTurns: nextNumOfTurns,
                    playerTurn: nextPlayerTurn,
                });
            }
        }
    };

    onResetButtonClick = () => {
        this.setState({
            board: this.initializeBoard(),
            isGameOver: false,
            playerTurn: PLAYER_X,
            numOfTurns: 0,
        });
    };

    render() {
        const { board, isGameOver, playerTurn, playerWon } = this.state;

        let renderHeader = null;
        let renderedResetButton = null;

        if (isGameOver) {
            if (playerWon) {
                renderHeader = <div>{`Player ${playerWon} has won`}</div>;
            } else {
                renderHeader = <div>{`Draw! No one has won`}</div>;
            }
            renderedResetButton = <button onClick={this.onResetButtonClick}>Play Again!</button>;
        } else {
            renderHeader = <div>{`Player ${playerTurn}'s Turn!`}</div>;
        }

        return (
            <div className="container">
                {renderHeader}
                {renderedResetButton}
                <div className="grid">
                    {
                        Object.keys(board).map(row => {
                            return (
                                <div key={`row_${row}`} className="gridRow">
                                    {
                                        Object.keys(board[row]).map(col => {
                                            return <div key={`col_${col}`} onClick={this.onCellClick.bind(this, row, col)} className="gridCell">{board[row][col]}</div>;
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default App;
