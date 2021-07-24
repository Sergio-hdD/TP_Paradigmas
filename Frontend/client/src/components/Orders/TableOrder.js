import { withStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/CheckCircle';

const TableOrder = () => {

    const { state } = useContext(DataContext)

    const { orders } = state

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 400,
        },
    });

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(3);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root} style={{ marginTop: '20px' }}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
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
                        {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                                    <TableCell>
                                        <Link to={`/orders/${order.id}`} style={{ 'color': 'black', 'textDecoration': 'underline' }}>
                                            {order.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{order.created_at}</TableCell>
                                    <TableCell>${order.total}</TableCell>
                                    <TableCell>
                                        {
                                            order.delivered ?
                                                <h5><Check /></h5>
                                                : <h5><Cancel /></h5>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            order.paid ?
                                                <h5><Check /></h5>
                                                : <h5><Cancel /></h5>
                                        }
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[3, 5, 10, 25, 100]}
                component="div"
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default TableOrder


/*

<StyledTableRow key={order.id}>
<StyledTableCell component="th" scope="row">
    <Link to={`/orders/${order.id}`} style={{ 'color': 'black', 'textDecoration': 'underline' }}>
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

*/