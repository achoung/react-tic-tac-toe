import React, { PureComponent } from 'react';
import './App.css';

// constants
const BOARD_SIZE = 3;
const TOTAL_NUM_OF_BOARD_CELLS = BOARD_SIZE * BOARD_SIZE;
const PLAYER_X = 'X';
const PLAYER_O = 'O';

const PLAYERS = ['X', 'O'];

class App extends PureComponent {

    state = {
        board: {},
        isGameOver: false,
        currentPlayer: null,
        numOfTurns: 0,
    };

    constructor() {
        super();
        this.state.board = this.initializeBoard();
        this.state.currentPlayer = this.getRandomPlayer();
    }

    initializeBoard() {
        const board = {};
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = {};
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = '';
            }
        }
        return board;
    }

    getRandomPlayer() {
        return PLAYERS[Math.floor(Math.random() * 2)];
    }

    /**
     * @returns {String | null} The player that has won or null if neither player has won
     */
    hasPlayerWon(board) {
        let playerWon = null;

        // vertical count mapping
        const playerCircleColMap = (new Array(BOARD_SIZE)).fill(0);
        const playerCrossColMap = (new Array(BOARD_SIZE)).fill(0);

        // horizontal count mapping
        const playerCrossRowMap = (new Array(BOARD_SIZE)).fill(0);
        const playerCircleRowMap = (new Array(BOARD_SIZE)).fill(0);

        // diagonal count mapping (top-left to bottom-right)
        let playerCrossDiagCount = 0;
        let playerCircleDiagCount = 0;

        // anti-diagonal count mapping (top-right to bottom-left)
        let playerCrossAntiDiagCount = 0;
        let playerCircleAntiDiagCount = 0;

        for (let row in board) {
            for (let col in board[row]) {
                const cellValue = board[row][col];

                // update horizontal and vertical counts
                if (cellValue === PLAYER_X) {
                    playerCrossRowMap[row]++;
                    playerCrossColMap[col]++;
                } else if (cellValue === PLAYER_O) {
                    playerCircleRowMap[row]++;
                    playerCircleColMap[col]++;
                }

                // update diagonal counts (upper-left to bottom-right)
                if (row === col) {
                    if (cellValue === PLAYER_X) {
                        playerCrossDiagCount++;
                    } else if (cellValue === PLAYER_O) {
                        playerCircleDiagCount++;
                    }
                }
            }
        }

        // update anti-diagonal counts (upper-right to bottom-left)
        for (let i=0; i<BOARD_SIZE; i++) {
            const cellValue = board[i][BOARD_SIZE - 1 - i];
            if (cellValue === PLAYER_X) {
                playerCrossAntiDiagCount++;
            } else if (cellValue === PLAYER_O) {
                playerCircleAntiDiagCount++;
            }
        }

        // player cross win conditions
        const playerCrossWonVertically = playerCrossColMap.some(colVal => colVal === BOARD_SIZE);
        const playerCrossWonHorizontally = playerCrossRowMap.some(rowVal => rowVal === BOARD_SIZE);
        const playerCrossWonDiagonally = playerCrossDiagCount === BOARD_SIZE;
        const playerCrossWonAntiDiagonally = playerCrossAntiDiagCount === BOARD_SIZE;

        // player circle win conditions
        const playerCircleWonVertically = playerCircleColMap.some(colVal => colVal === BOARD_SIZE);
        const playerCircleWonHorizontally = playerCircleRowMap.some(rowVal => rowVal === BOARD_SIZE);
        const playerCircleWonDiagonally = playerCircleDiagCount === BOARD_SIZE;
        const playerCircleWonAntiDiagonally = playerCircleAntiDiagCount === BOARD_SIZE;

        if (playerCrossWonHorizontally || playerCrossWonVertically || playerCrossWonDiagonally || playerCrossWonAntiDiagonally) {
            playerWon = PLAYER_X;
        } else if (playerCircleWonHorizontally || playerCircleWonVertically || playerCircleWonDiagonally || playerCircleWonAntiDiagonally) {
            playerWon = PLAYER_O;
        }

        return playerWon;
    }

    onCellClick(row, col) {
        const { board, numOfTurns, currentPlayer, isGameOver } = this.state;

        if (isGameOver) {
            return;
        }

        if (board[row][col] === '') {
            const updatedBoard = JSON.parse(JSON.stringify(board));
            updatedBoard[row][col] = currentPlayer;
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
                    currentPlayer: null,
                    playerWon: null,
                });
            } else {
                const nextcurrentPlayer = (currentPlayer === PLAYER_X) ? PLAYER_O : PLAYER_X;
                this.setState({
                    board: updatedBoard,
                    numOfTurns: nextNumOfTurns,
                    currentPlayer: nextcurrentPlayer,
                });
            }
        }
    };

    onResetButtonClick = () => {
        this.setState({
            board: this.initializeBoard(),
            isGameOver: false,
            currentPlayer: this.getRandomPlayer(),
            numOfTurns: 0,
        });
    };

    render() {
        const { board, isGameOver, currentPlayer, playerWon } = this.state;

        let renderHeader = null;
        let renderedResetButton = null;

        if (isGameOver) {
            if (playerWon) {
                renderHeader = <div>{`Player ${playerWon} won`}</div>;
            } else {
                renderHeader = <div>{`Draw! No one won`}</div>;
            }
            renderedResetButton = <button onClick={this.onResetButtonClick}>Play Again!</button>;
        } else {
            renderHeader = <div>{`Player ${currentPlayer}'s Turn!`}</div>;
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
