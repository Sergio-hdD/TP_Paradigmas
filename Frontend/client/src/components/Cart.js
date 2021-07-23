import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BookIcon from '@material-ui/icons/Book';
import DeleteIcon from '@material-ui/icons/Delete';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'
import PaypalBtn from './Checkout/PayPalBtn';

const Cart = () => {

    const { state, dispatch } = useContext(DataContext)

    const { cart, auth } = state

    const [address, setAddress] = useState('')
    const [mobile, setMobile] = useState('')
    const [payment, setPayment] = useState(false)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const getTotal = () => {
            const res = cart.reduce((prev, item) => {
                return prev + item.price
            }, 0)

            setTotal(res)
        }

        getTotal()

    }, [cart])

    const handlePayment = () => {
        if (!mobile || !address)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Please add your address and mobile', show: true } })
        setPayment(true)
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            maxWidth: 752,
            margin: 'auto'
        },
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            margin: theme.spacing(3, 0, 2),
        },
    }));

    const classes = useStyles();

    if (cart.length === 0) {
        return (
            <Container maxWidth="md" component="main">
                <Grid container spacing={2} >
                    <Grid item xs={12} md={12}>
                        <Typography variant="h5" className={classes.title}>
                            <ShoppingCart style={{ fontSize: 180 }} />
                        </Typography>
                        <Typography variant="h5" className={classes.title}>
                            Your Shopping cart is empty
                        </Typography>
                        <Typography variant="subtitle1" className={classes.title}>
                            Looks like you haven't made your choice yet...
                        </Typography>
                        <Box className={classes.title}>
                            <Button variant="outlined" color="primary" component={Link} to="/">
                                Continue Shopping
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        )
    }

    return (

        <Container maxWidth="md" component="main">
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Typography variant="h5" className={classes.title}>
                        Cart
                    </Typography>
                    <div className={classes.demo}>
                        {
                            cart.map((book) => (

                                <List key={book.id}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt="https://source.unsplash.com/random"
                                                src="https://source.unsplash.com/random"
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={book.title}
                                            secondary={`$ ${book.price}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" color="secondary"
                                                onClick={() => dispatch({
                                                    type: 'ADD_MODAL',
                                                    payload: [{ data: cart, id: book.id, title: book.title, show: true, type: 'ADD_CART' }]
                                                })}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    <Divider />
                                </List>
                            ))
                        }

                    </div>
                </Grid>

                <Grid item xs={12} md={5}>
                    <div className={classes.demo}>
                        <form>
                            <Typography variant="h5" className={classes.title}>
                                Shipping
                            </Typography>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="address"
                                label="Address"
                                name="address"
                                onChange={e => setAddress(e.target.value)}
                            />

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="mobile"
                                label="Mobile"
                                name="mobile"
                                onChange={e => setMobile(e.target.value)}
                            />
                        </form>

                        <h3>Total: <span>${total}</span></h3>

                        {
                            payment
                                ? <PaypalBtn total={total}
                                    address={address}
                                    mobile={mobile}
                                    state={state}
                                    dispatch={dispatch}
                                />
                                : <Button variant="contained" color="primary" component={Link} to={auth.user ? "#" : "/login"}>
                                    <a className="btn btn-dark my-2" onClick={auth.user ? handlePayment : 0}>Proceed with payment</a>
                                </Button>
                        }

                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Cart