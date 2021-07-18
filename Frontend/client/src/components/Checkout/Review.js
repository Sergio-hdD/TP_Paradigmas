import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const Review = ({ checkoutDates }) => {

    const { state } = useContext(DataContext)

    const { cart } = state

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

    const useStyles = makeStyles((theme) => ({
        listItem: {
            padding: theme.spacing(1, 0),
        },
        total: {
            fontWeight: 700,
        },
        title: {
            marginTop: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <List disablePadding>
                {cart.map((book) => (
                    <ListItem className={classes.listItem} key={book.id}>
                        <ListItemText primary={book.title} secondary={`${book.description.substring(0, 70)}...`} />
                        <Typography variant="body2">${book.price}</Typography>
                    </ListItem>
                ))}
                <ListItem className={classes.listItem}>
                    <ListItemText primary="Total" />
                    <Typography variant="subtitle1" className={classes.total}>
                        ${total}
                    </Typography>
                </ListItem>
            </List>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Shipping
                    </Typography>
                    <Typography gutterBottom>{checkoutDates.firstName + ' ' + checkoutDates.lastName}</Typography>
                    <Typography gutterBottom>
                        {
                            checkoutDates.address + ' ' +
                            checkoutDates.city + ' ' +
                            checkoutDates.province + ' ' +
                            checkoutDates.postalCode + ' '
                        }
                    </Typography>
                </Grid>
                <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom className={classes.title}>
                        Payment details
                    </Typography>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Card type</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Visa</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Card holder</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{checkoutDates.cardName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Card number</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{checkoutDates.cardNumber}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>Expiry date</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography gutterBottom>{checkoutDates.expiryDate}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Review