import { withStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditICon from '@material-ui/icons/EditRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom'

const BookIndex = () => {

    const { state, dispatch } = useContext(DataContext)

    const { books } = state

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
        <Container maxWidth="md" component="main">

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>TITLE</StyledTableCell>
                            <StyledTableCell align="left">DESCRIPTION</StyledTableCell>
                            <StyledTableCell align="left">PRICE</StyledTableCell>
                            <StyledTableCell align="left">UPDATE</StyledTableCell>
                            <StyledTableCell align="left">DELETE</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            books.map((book) => (
                                <StyledTableRow key={book.id}>
                                    <StyledTableCell component="th">{book.title}</StyledTableCell>
                                    <StyledTableCell align="left">{book.description}</StyledTableCell>
                                    <StyledTableCell align="left">${book.price}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton color="inherit" component={Link} to={`books/edit/${book.id}`}>
                                            <EditICon />
                                        </IconButton>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <IconButton color="inherit"
                                            onClick={() => dispatch({
                                                type: 'ADD_MODAL',
                                                payload: [{ data: books, id: book.id, title: book.title, type: 'DELETE_PRODUCT', show: true }]
                                            })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default BookIndex