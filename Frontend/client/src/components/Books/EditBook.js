import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Card } from '@material-ui/core';
import { getData, putData } from '../../utils/fetchData'
import Container from '@material-ui/core/Container';
import BookCard from './BookCard';
import Button from '@material-ui/core/Button'
import { validBook } from '../../utils/valid'
import { updateItem } from '../../store/Actions';


const BookEdit = ({ match }) => {

    const { state, dispatch } = useContext(DataContext)

    const { books } = state

    const [book, setBook] = useState({})

    useEffect(() => {

        getData(`books/${match.params.id}`).then(res => {
            setBook(res)
        })

    }, [match.params.id])

    const handleChangeInput = e => {
        const { name, value } = e.target
        setBook({ ...book, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const errorMsg = validBook(book.title, book.description, book.price, book.inStock);

        if (errorMsg) return dispatch({ type: 'NOTIFY', payload: { error: errorMsg, show: true } })

        const res = await putData(`books/${book.id}`, book)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } }) 

        dispatch(updateItem(books, book.id, res.book, 'ADD_BOOKS'))

        return dispatch({ type: 'NOTIFY', payload: { success: res.msg, show: true } }) 

    }

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing="2">
                <Grid item md="6">
                    <Card style={{ padding: '30px' }}>
                        <form onSubmit={handleSubmit}>
                            <Typography gutterBottom variant="h5" component="h2" style={{ paddingBottom: '10px' }} >
                                Update Book
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="title"
                                        name="title"
                                        label="Title"
                                        variant="outlined"
                                        fullWidth
                                        value={book.title}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChangeInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        id="price"
                                        name="price"
                                        label="Price"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        value={book.price}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChangeInput}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="description"
                                        name="description"
                                        label="Description"
                                        variant="outlined"
                                        fullWidth
                                        value={book.description}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChangeInput}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="inStock"
                                        name="inStock"
                                        label="Stock"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        value={book.inStock}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={handleChangeInput}
                                    />
                                </Grid>
                            </Grid>

                            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
                                Update
                            </Button>
                        </form>
                    </Card>
                </Grid>
                <Grid item md="3">
                    <BookCard book={book} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default BookEdit