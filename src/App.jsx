import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import AppBar from './AppBar';
import './App.css';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        type: 'dark',
    },
});

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 10,
    },
    header: {
        display: 'flex',
        minWidth: 300,
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
    },
    headerTitle: {
        flex: '1 auto',
    },
    resetButton: {
        flex: '1 auto',
        padding: 5,
        maxWidth: 100,
    },
    grid: {
        maxWidth: 400,
    },    
    gridRow: {
        display: 'flex',
    },
    gridCell: {
        cursor: 'pointer',
        flex: '1 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        background: 'orange',
        height: 100,
        width: 100,
    }
};

// constants
const BOARD_DIMENSION = 3;
const TOTAL_NUM_OF_BOARD_CELLS = BOARD_DIMENSION * BOARD_DIMENSION;
const PLAYER_X = 'X';
const PLAYER_O = 'O';

const PLAYERS = ['X', 'O'];

class App extends PureComponent {
    static PropTypes = {
        classes: PropTypes.object.isRequired,
    };

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
        for (let i = 0; i < BOARD_DIMENSION; i++) {
            board[i] = {};
            for (let j = 0; j < BOARD_DIMENSION; j++) {
                board[i][j] = '';
            }
        }
        return board;
    }

    getRandomPlayer() {
        // math.random logic returns back either 0 or 1
        return PLAYERS[Math.floor(Math.random() * 2)];
    }

    /**
     * @returns {String | null} The player that has won or null if neither player has won
     */
    hasPlayerWon(board) {
        let playerWon = null;

        // vertical count mapping
        const playerCircleColMap = (new Array(BOARD_DIMENSION)).fill(0);
        const playerCrossColMap = (new Array(BOARD_DIMENSION)).fill(0);

        // horizontal count mapping
        const playerCrossRowMap = (new Array(BOARD_DIMENSION)).fill(0);
        const playerCircleRowMap = (new Array(BOARD_DIMENSION)).fill(0);

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
        for (let i=0; i<BOARD_DIMENSION; i++) {
            const cellValue = board[i][BOARD_DIMENSION - 1 - i];
            if (cellValue === PLAYER_X) {
                playerCrossAntiDiagCount++;
            } else if (cellValue === PLAYER_O) {
                playerCircleAntiDiagCount++;
            }
        }

        // player cross win conditions
        const playerCrossWonVertically = playerCrossColMap.some(colVal => colVal === BOARD_DIMENSION);
        const playerCrossWonHorizontally = playerCrossRowMap.some(rowVal => rowVal === BOARD_DIMENSION);
        const playerCrossWonDiagonally = playerCrossDiagCount === BOARD_DIMENSION;
        const playerCrossWonAntiDiagonally = playerCrossAntiDiagCount === BOARD_DIMENSION;

        // player circle win conditions
        const playerCircleWonVertically = playerCircleColMap.some(colVal => colVal === BOARD_DIMENSION);
        const playerCircleWonHorizontally = playerCircleRowMap.some(rowVal => rowVal === BOARD_DIMENSION);
        const playerCircleWonDiagonally = playerCircleDiagCount === BOARD_DIMENSION;
        const playerCircleWonAntiDiagonally = playerCircleAntiDiagCount === BOARD_DIMENSION;

        if (playerCrossWonHorizontally || playerCrossWonVertically || playerCrossWonDiagonally || playerCrossWonAntiDiagonally) {
            playerWon = PLAYER_X;
        } else if (playerCircleWonHorizontally || playerCircleWonVertically || playerCircleWonDiagonally || playerCircleWonAntiDiagonally) {
            playerWon = PLAYER_O;
        }

        return playerWon;
    }

    onCellClick(row, col) {
        const { board, numOfTurns, currentPlayer, isGameOver } = this.state;

        // if game is over do, nothing
        if (isGameOver) {
            return;
        }

        if (board[row][col] === '') {
            const updatedBoard = JSON.parse(JSON.stringify(board));
            updatedBoard[row][col] = currentPlayer;
            const nextNumOfTurns = numOfTurns + 1;

            const hasPlayerWon = this.hasPlayerWon(updatedBoard);

            // check if a player has won from clicking on a cell
            if (hasPlayerWon) {
                this.setState({
                    board: updatedBoard,
                    isGameOver: true,
                    numOfTurns: nextNumOfTurns,
                    playerWon: hasPlayerWon,
                });
            // check "Draw" condition if all grid cells are taken and no one has won yet
            } else if (nextNumOfTurns === TOTAL_NUM_OF_BOARD_CELLS) {
                this.setState({
                    board: updatedBoard,
                    isGameOver: true,
                    numOfTurns: nextNumOfTurns,
                    currentPlayer: null,
                    playerWon: null,
                });
            } else {
                // switch to the next player's turn
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
        const { classes } = this.props;
        const { board, isGameOver, currentPlayer, playerWon } = this.state;

        let renderHeader = null;
        let renderedResetButton = null;

        if (isGameOver) {
            if (playerWon) {
                renderHeader = <div className={classes.headerTitle}>{`Player ${playerWon} won`}</div>;
            } else {
                renderHeader = <div className={classes.headerTitle}>{`Draw! No one won`}</div>;
            }
            renderedResetButton = <button className={classes.resetButton} onClick={this.onResetButtonClick}>Play Again!</button>;
        } else {
            renderHeader = <div className={classes.headerTitle}>{`Player ${currentPlayer}'s Turn!`}</div>;
        }

        return (
            <MuiThemeProvider theme={theme}>
                <AppBar />
                <div className={classes.container}>
                    <div className={classes.header}>
                        {renderHeader}
                        {renderedResetButton}
                    </div>
                    <div className={classes.grid}>
                        {
                            Object.keys(board).map(row => {
                                return (
                                    <div key={`row_${row}`} className={classes.gridRow}>
                                        {
                                            Object.keys(board[row]).map(col => {
                                                return (
                                                    <div
                                                        key={`col_${col}`}
                                                        onClick={this.onCellClick.bind(this, row, col)}
                                                        className={classes.gridCell}
                                                    >
                                                        {board[row][col]}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);
