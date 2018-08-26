/**
 * Copyright (c) 2018 Andrew Choung
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import AppBar from 'components/AppBar';
import { APP_BAR_TITLE, TOOLBAR_ITEMS } from 'constants/appBarConstants';
import {
    BOARD_DIMENSION,
    TOTAL_NUM_OF_BOARD_CELLS,
    PLAYER_X,
    PLAYER_O,
    PLAYERS,
} from 'constants/appConstants';

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
    },
    header: {
        display: 'flex',
        minWidth: 300,
        minHeight: 75,
        alignItems: 'center',
        textAlign: 'center',
    },
    headerTitle: {
        flex: '1 auto',
    },
    resetButton: {
        flex: '0 auto',
        padding: '6px 12px',
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
        backgroundColor: '#FFF',
        height: 100,
        width: 100,
    },
    winGridCell: {
        // light-green
        backgroundColor: '#90ee90',
    },
    playerCross: {
        // dark red
        color: '#8b0000',
    },
    playerCircle: {
        // dark green-blue
        color: '#003636',
    },
    gameOverText: {
        color: 'orange',
    },
};

class App extends PureComponent {
    static propTypes = {
        // props from HOCs
        classes: PropTypes.object.isRequired,
    };

    state = {
        board: {},
        isGameOver: false,
        currentPlayer: null,
        playerWon: null,
        numOfTurns: 0,
        winCondition: [],
    };

    constructor() {
        super();
        this.state.board = this.initializeBoard();
        this.state.currentPlayer = this.getRandomPlayer();
    }

    /**
     * Returns an initialized empty grid by the set dimensions.
     *
     * @returns {Object} An initialized empty grid
     */
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

    /**
     * Randomly picks and returns player "X" or "O".
     *
     * @returns {String} Either "X" or "O"
     */
    getRandomPlayer() {
        // math.random logic returns back either 0 or 1
        return PLAYERS[Math.floor(Math.random() * 2)];
    }

    /**
     * Checks the winning conditions in the board to determine if either player has won or neither player has won.
     *
     * @param {Object} board The current board cells
     * @returns {String|null} Either Player "X" or Player "O" that has won or null if neither player has won
     */
    hasPlayerWon(board) {
        let playerWon = null;
        let winCondition = [];

        // vertical count mapping
        const playerCircleColMap = {};
        const playerCrossColMap = {};

        // horizontal count mapping
        const playerCrossRowMap = {};
        const playerCircleRowMap = {};

        // diagonal count mapping (top-left to bottom-right)
        const playerCrossDiagMap = [];
        const playerCircleDiagMap = [];

        // anti-diagonal count mapping (top-right to bottom-left)
        const playerCrossAntiDiagMap = [];
        const playerCircleAntiDiagMap = [];

        for (let row in board) {
            for (let col in board[row]) {
                const cellValue = board[row][col];

                // update horizontal and vertical counts
                if (cellValue === PLAYER_X) {
                    if (playerCrossColMap[col]) {
                        playerCrossColMap[col].push({ row, col });
                    } else {
                        playerCrossColMap[col] = [{ row, col }];
                    }

                    if (playerCrossRowMap[row]) {
                        playerCrossRowMap[row].push({ row, col });
                    } else {
                        playerCrossRowMap[row] = [{ row, col }];
                    }
                } else if (cellValue === PLAYER_O) {
                    if (playerCircleColMap[col]) {
                        playerCircleColMap[col].push({ row, col });
                    } else {
                        playerCircleColMap[col] = [{ row, col }];
                    }

                    if (playerCircleRowMap[row]) {
                        playerCircleRowMap[row].push({ row, col });
                    } else {
                        playerCircleRowMap[row] = [{ row, col }];
                    }
                }

                // update diagonal counts (upper-left to bottom-right)
                if (row === col) {
                    if (cellValue === PLAYER_X) {
                        playerCrossDiagMap.push({ row, col });
                    } else if (cellValue === PLAYER_O) {
                        playerCircleDiagMap.push({ row, col });
                    }
                }
            }
        }

        // update anti-diagonal counts (upper-right to bottom-left)
        for (let row = 0; row < BOARD_DIMENSION; row++) {
            const col = BOARD_DIMENSION - 1 - row;
            const cellValue = board[row][col];

            if (cellValue === PLAYER_X) {
                playerCrossAntiDiagMap.push({
                    row: row.toString(),
                    col: col.toString(),
                });
            } else if (cellValue === PLAYER_O) {
                playerCircleAntiDiagMap.push({
                    row: row.toString(),
                    col: col.toString(),
                });
            }
        }

        // check if player cross has a win condition
        const playerCrossWinCondition = this.findWinCondition({
            colMap: playerCrossColMap,
            rowMap: playerCrossRowMap,
            diagMap: playerCrossDiagMap,
            antiDiagMap: playerCrossAntiDiagMap,
        });

        if (playerCrossWinCondition.length === BOARD_DIMENSION) {
            playerWon = PLAYER_X;
            winCondition = playerCrossWinCondition;
        } else {
            // check if player circle has a win condition
            const playerCircleWinCondition = this.findWinCondition({
                colMap: playerCircleColMap,
                rowMap: playerCircleRowMap,
                diagMap: playerCircleDiagMap,
                antiDiagMap: playerCircleAntiDiagMap,
            });

            if (playerCircleWinCondition.length === BOARD_DIMENSION) {
                playerWon = PLAYER_O;
                winCondition = playerCircleWinCondition;
            }
        }

        return { playerWon, winCondition };
    }

    /**
     * Checks each of a player's possible winning conditions and returns the first mapping that has won.
     * If none of the mappings are winning conditions, return null to signify that the player has not won.
     * 
     * @param {Object} colMap The column mapping of a player's cells
     * @param {Object} rowMap The row mapping of a player's cells
     * @param {Object} diagMap The diagonal (top-left to bottom-right) mapping of a player's cells
     * @param {Object} antiDiagMap The anti-diagonal (top-right to bottom-left) mapping of a player's cells
     * @returns {Object|null} The winning mapping or null if the player has not won
     */
    findWinCondition({ colMap, rowMap, diagMap, antiDiagMap }) {
        // check horizontally
        const colKeys = Object.keys(colMap);
        for (let i = 0; i < colKeys.length; i++) {
            const colMapList = colMap[colKeys[i]];
            if (colMapList.length === BOARD_DIMENSION) {
                return colMapList;
            }
        }

        // check vertically
        const rowKeys = Object.keys(rowMap);
        for (let i = 0; i < rowKeys.length; i++) {
            const rowMapList = rowMap[rowKeys[i]];
            if (rowMapList.length === BOARD_DIMENSION) {
                return rowMapList;
            }
        }

        // check diagonal and anti-diagonal
        if (diagMap.length === BOARD_DIMENSION) {
            return diagMap;
        } else if (antiDiagMap.length === BOARD_DIMENSION) {
            return antiDiagMap;
        } else {
            return [];
        }
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

            const { playerWon, winCondition } = this.hasPlayerWon(updatedBoard);

            // check if a player has won from clicking on a cell
            if (playerWon) {
                this.setState({
                    board: updatedBoard,
                    isGameOver: true,
                    numOfTurns: nextNumOfTurns,
                    playerWon,
                    winCondition,
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

    /**
     * Handles the event when the reset button has been clicked.
     */
    onResetButtonClick = () => {
        this.setState({
            board: this.initializeBoard(),
            isGameOver: false,
            currentPlayer: this.getRandomPlayer(),
            numOfTurns: 0,
            winCondition: [],
        });
    };

    /**
     * Checks if a cell is part of a win condition.
     *
     * @param {String} row The cell row number
     * @param {String} col The cell column number
     * @returns {Boolean} Returns true if the cell is a win condition or false otherwise
     */
    isCellWinCondition(row, col) {
        const { winCondition } = this.state;
        return winCondition.some(winCell => (winCell.row === row && winCell.col === col));
    }

    /**
     * Renders the component in JSX syntax
     * 
     * @returns {JSX} the component view
     */
    render() {
        const { classes } = this.props;
        const { board, isGameOver, currentPlayer, playerWon } = this.state;

        let headerText = null;
        let renderedResetButton = null;
        let headerTitleClassName = classes.headerTitle;
        if (isGameOver) {
            headerText = playerWon ? `Player ${playerWon} won` : 'Draw!';
            headerTitleClassName += ` ${classes.gameOverText}`;

            renderedResetButton = (
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.resetButton}
                    onClick={this.onResetButtonClick}
                >
                    {'Play Again!'}
                </Button>
            );
        } else {
            headerText = `Player ${currentPlayer}'s Turn!`;
        }

        return (
            <MuiThemeProvider theme={theme}>
                <AppBar title={APP_BAR_TITLE} toolbarItems={TOOLBAR_ITEMS} />
                <div className={classes.container}>
                    <div className={classes.header}>
                        <Typography variant="headline" className={headerTitleClassName}>
                            {headerText}
                        </Typography>
                        {renderedResetButton}
                    </div>
                    <div className={classes.grid}>
                        {
                            Object.keys(board).map(row => {
                                return (
                                    <div key={`row_${row}`} className={classes.gridRow}>
                                        {
                                            Object.keys(board[row]).map(col => {
                                                const cellValue = board[row][col];

                                                // determine how to style the X's or O's
                                                let cardContentClassName;
                                                if (cellValue === PLAYER_X) {
                                                    cardContentClassName = classes.playerCross;
                                                } else if (cellValue === PLAYER_O) {
                                                    cardContentClassName = classes.playerCircle;
                                                }

                                                // determine if the cell is a win-cell or not if the game is over
                                                let cardClassName = classes.gridCell;
                                                let isWinCell = this.isCellWinCondition(row, col);
                                                if (isGameOver && isWinCell) {
                                                    cardClassName += ` ${classes.winGridCell}`;
                                                }

                                                return (
                                                    <Card
                                                        key={`col_${col}`}
                                                        onClick={this.onCellClick.bind(this, row, col)}
                                                        className={cardClassName}
                                                    >
                                                        <CardContent>
                                                            <Typography className={cardContentClassName} variant="display2">
                                                                {board[row][col]}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
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
