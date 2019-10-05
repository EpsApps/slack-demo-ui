import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Table.css';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    }
});

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static propTypes = {
        rows: PropTypes.array.isRequired,
        columnHeaders: PropTypes.array.isRequired
    }

    renderTableHead = () => {
        let cells = this.props.columnHeaders.map((columnHeader, index) => {
            return (
                <TableCell key={`column-header-${index}`}>{columnHeader.label}</TableCell>
            )
        });
        return (
            <TableHead>
                <TableRow>
                    {cells}
                </TableRow>
            </TableHead>
        )
    }

    renderTableBody = () => {
        let rows = this.props.rows.map((row, rowIndex) => {
            let cells = this.props.columnHeaders.map((columnHeader, cellIndex) => {
                let field = columnHeader.field;
                let value;
                /** 
                 * @todo make this recursive to account for deeply nested objects 
                 * this part could be abstracted a bit more
                 */
                if (field.includes('.')) {
                    let fields = field.split('.');
                    let parentValue = row[fields[0]];
                    value = parentValue[fields[1]];
                } else {
                    value = row[field];
                }
                if (columnHeader.type == 'image') {
                    value = (
                        <img src={value}/>
                    );
                }
                if (!value) value = '--';
                return (
                    <TableCell key={`table-cell-${cellIndex}`}>{value}</TableCell>
                )
            });
            return (
                <TableRow key={`table-row-${rowIndex}`}>
                    {cells}
                </TableRow>
            )
        })
        return (
            <TableBody>
                {rows}
            </TableBody>
        )
    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <MUITable className={classes.table}>
                    {this.renderTableHead()}
                    {this.renderTableBody()}
                </MUITable>
            </Paper>
        );
    }

}

export default withStyles(styles)(Table);