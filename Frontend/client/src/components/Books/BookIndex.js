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
import EditIcon from '@material-ui/icons/EditRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';

const BookIndex = () => {

    const { state, dispatch } = useContext(DataContext)

    const { books } = state

    const useStyles = makeStyles({
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 440,
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
        <Container maxWidth="md" component="main">
            <Paper className={classes.root} style={{marginTop: '20px'}}>
                <Button style={{width: '100%'}} component={Link} to="/books/new">ADD BOOK</Button>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>TITLE</StyledTableCell>
                                <StyledTableCell>DESCRIPTION</StyledTableCell>
                                <StyledTableCell>PRICE</StyledTableCell>
                                <StyledTableCell>STOCK</StyledTableCell>
                                <StyledTableCell>EDIT</StyledTableCell>
                                <StyledTableCell>DELETE</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((book) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={book.id}>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.description}</TableCell>
                                        <TableCell>${book.price}</TableCell>
                                        <TableCell>{book.inStock}</TableCell>
                                        <TableCell>
                                            <IconButton color="inherit" component={Link} to={`books/edit/${book.id}`}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="inherit"
                                                onClick={() => dispatch({
                                                    type: 'ADD_MODAL',
                                                    payload: [{ data: books, id: book.id, title: book.title, type: 'DELETE_PRODUCT', show: true }]
                                                })}>
                                                <DeleteIcon />
                                            </IconButton>
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
                    count={books.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
}

export default BookIndex