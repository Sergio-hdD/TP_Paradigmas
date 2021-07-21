import { withStyles } from '@material-ui/core/styles';
import React, { useState, useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/CheckCircle';
import { Link } from 'react-router-dom' 

const TableOrder = () => {

    const { state } = useContext(DataContext)

    const { orders } = state

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const StyledTableRow = withStyles((theme) => ({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>ID</StyledTableCell>
                        <StyledTableCell align="right">DATE</StyledTableCell>
                        <StyledTableCell align="right">TOTAL</StyledTableCell>
                        <StyledTableCell align="right">DELIVERED</StyledTableCell>
                        <StyledTableCell align="right">PAID</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <StyledTableRow key={order.id}>
                            <StyledTableCell component="th" scope="row">
                                <Link to={`/orders/${order.id}`} style={{'color': 'black', 'textDecoration': 'underline'}}>
                                    {order.id}
                                </Link>
                            </StyledTableCell>
                            <StyledTableCell align="right">{order.created_at}</StyledTableCell>
                            <StyledTableCell align="right">${order.total}</StyledTableCell>
                            <StyledTableCell align="center">
                                {
                                    order.delivered ?
                                        <h5><Check /></h5>
                                        : <h5><Cancel /></h5>
                                }
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                {
                                    order.paid ?
                                        <h5><Check /></h5>
                                        : <h5><Cancel /></h5>
                                }
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TableOrder