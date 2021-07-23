import React, { useState, useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Card } from '@material-ui/core';
import { postData } from '../../utils/fetchData'
import Container from '@material-ui/core/Container';
import BookCard from './BookCard';
import Button from '@material-ui/core/Button'
import { validBook } from '../../utils/valid'

const CreateBook = () => {

    const { state, dispatch } = useContext(DataContext)

    const { auth } = state

    const [book, setBook] = useState({
        title: '',
        description: '',
        price: 0,
        inStock: 0
    })

    const handleChangeInput = e => {
        const { name, value } = e.target
        setBook({ ...book, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const errorMsg = validBook(book.title, book.description, book.price, book.inStock);

        if (errorMsg) return dispatch({ type: 'NOTIFY', payload: { error: errorMsg, show: true } })

        const res = await postData(`books`, book)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err, show: true } }) 

        return dispatch({ type: 'NOTIFY', payload: { success: res.msg, show: true } }) 

    }

    if(!auth.user) return null

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" style={{ marginTop: '30px' }} spacing="2">
                <Grid item md="6">
                    <Card style={{ padding: '30px' }}>
                        <form onSubmit={handleSubmit}>
                            <Typography gutterBottom variant="h5" component="h2" style={{ paddingBottom: '10px' }} >
                                Create Book
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
                                        type="number"
                                        variant="outlined"
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
                                        type="number"
                                        variant="outlined"
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
                                Create
                            </Button>
                        </form>
                    </Card>
                </Grid>
                <Grid item md="3">
                    <BookCard book={book} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default CreateBook