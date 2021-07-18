import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useContext } from 'react';
import { getData } from '../../utils/fetchData'
import Paper from '@material-ui/core/Paper'
import ButtonBase from '@material-ui/core/ButtonBase'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

const BookItemList = ({ book }) => {

    const { state, dispatch } = useContext(DataContext)

    const { books, cart } = state

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(2),
            margin: 'auto'
        },
        image: {
            width: 210,
            height: 150,
        },
        img: {
            margin: 'auto',
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.root} maxWidth="md">
            <Paper className={classes.paper}>
                <Grid container spacing={2}>
                    <Grid item>
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src="https://source.unsplash.com/random" style={{objectFit: 'cover'}} />
                        </ButtonBase>
                    </Grid>
                    <Grid item xs={12} sm container>
                        <Grid item xs container direction="column" spacing={2}>
                            <Grid item xs>
                                <Typography gutterBottom variant="subtitle1">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" gutterBottom>
                                    {book.description}
                                    {book.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    In Stock
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">${book.price}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

export default BookItemList