/**
 * Copyright (c) 2018 Andrew Choung
 */
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Cell from './Cell';

const styles = {
    grid: {
        maxWidth: 400,
    },
    gridRow: {
        display: 'flex',
    },
    gameOverGridCell: {
        cursor: 'initial',
    },
    winGridCell: {
        // light-green
        backgroundColor: '#90ee90',
    },
};

/**
 * This class renders a Tic-Tac-Toe Board.
 * 
 * @class Board
 * @extends PureComponent
 */
class Board extends PureComponent {
    static propTypes = {
        // props from HOCs
        classes: PropTypes.object.isRequired,

        // component props
        board: PropTypes.object,
        isGameOver: PropTypes.bool,
        winCondition: PropTypes.arrayOf(PropTypes.object),
        onCellClick: PropTypes.func,
    };

    static defaultProps = {
        board: {},
        isGameOver: false,
        winCondition: [],
        onCellClick: () => {},
    };

    /**
     * Handles the event when a cell has been clicked.
     * 
     * @param {Object} data The clicked grid cell data
     */
    onCellClick = data => {
        const { onCellClick } = this.props;
        onCellClick(data);
    }

    /**
     * Checks if a cell is part of a win condition.
     *
     * @param {String} row The cell row number
     * @param {String} col The cell column number
     * @returns {Boolean} Returns true if the cell is a win condition or false otherwise
     */
    isCellWinCondition(row, col) {
        const { winCondition } = this.props;
        return winCondition.some(winCell => (winCell.row === row && winCell.col === col));
    }

    /**
     * Renders the component in JSX syntax
     * 
     * @returns {JSX} the component view
     */
    render() {
        const { classes, board, isGameOver} = this.props;
        return (
            <div className={classes.grid}>
                {
                    Object.keys(board).map(row => {
                        return (
                            <div key={`row_${row}`} className={classes.gridRow}>
                                {
                                    Object.keys(board[row]).map(col => {
                                        // determine cell styling if the game is over and the winning cells
                                        let customClassName = null;
                                        if (isGameOver) {
                                            customClassName = classNames(classes.gameOverGridCell, {
                                                [classes.winGridCell]: this.isCellWinCondition(row, col),
                                            });
                                        }

                                        return (
                                            <Cell
                                                key={`cell_${row}_${col}`}
                                                row={row}
                                                column={col}
                                                value={board[row][col]}
                                                onClick={this.onCellClick}
                                                customClassName={customClassName}
                                            />
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
export default withStyles(styles)(Board);
