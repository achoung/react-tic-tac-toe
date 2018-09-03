/**
 * Copyright (c) 2018 Andrew Choung
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import { PLAYER_X, PLAYER_O } from './constants';

const styles = {
    gridCell: {
        userSelect: 'none',
        cursor: 'pointer',
        flex: '1 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        backgroundColor: 'white',
        height: 100,
        width: 100,
    },
    cardContent: {
        textShadow: '1px 1px black',
    },
    playerCross: {
        // dark red
        color: '#8b0000',
    },
    playerCircle: {
        // dark green-blue
        color: '#003636',
    },
};

/**
 * This class renders a Tic-Tac-Toe cell.
 * 
 * @class Cell
 * @extends PureComponent
 */
class Cell extends PureComponent {
    static propTypes = {
        // props from HOCs
        classes: PropTypes.object.isRequired,

        // component props
        column: PropTypes.string.isRequired,
        row: PropTypes.string.isRequired,
        value: PropTypes.string,
        customClassName: PropTypes.string,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        value: '',
        customClassName: PropTypes.string,
        onClick: () => {}
    };

    /**
     * Handles the event when a card has been clicked.
     */
    onCardClick = () => {
        const { onClick, row, column } = this.props;
        onClick({ row, column });
    };

    /**
     * Renders the component in JSX syntax
     * 
     * @returns {JSX} the component view
     */
    render() {
        const { classes, customClassName, value } = this.props;

        // determine if the cell is a win-cell or not if the game is over
        const cardClassName = classNames(classes.gridCell, customClassName);

        // render the cell card text
        let renderedCardContent = null;
        if (value) {
            // determine how to style the X's or O's
            const cardContentClassName = classNames(classes.cardContent, {
                [classes.playerCross]: value === PLAYER_X,
                [classes.playerCircle]: value === PLAYER_O,
            });

            renderedCardContent = (
                <CardContent>
                    <Typography className={cardContentClassName} variant="display2">
                        {value}
                    </Typography>
                </CardContent>
            );
        }

        return (
            <Card onClick={this.onCardClick} className={cardClassName}>
                {renderedCardContent}
            </Card>
        );
    }
}
export default withStyles(styles)(Cell);
