import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react';
import { getData } from '../../utils/fetchData'
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Paper from '@material-ui/core/Paper'
import ButtonBase from '@material-ui/core/ButtonBase'
import Divider from '@material-ui/core/Divider'
import Navbar from '../Navbar'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

const Book = ({ match }) => {

    const { state, dispatch } = useContext(DataContext)

    const { cart } = state

    const [book, setBook] = useState({})

    useEffect(() => {
        getData(`books/${match.params.id}`).then(res => {
            setBook(res)
        })
    }, [match.params.id])

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        paper: {
            padding: theme.spacing(2),
            margin: 'auto',
            maxWidth: 800,
        },
        image: {
            width: 210,
            height: 200,
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
        <>
            <Navbar />
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <ButtonBase className={classes.image}>
                                <img className={classes.img} alt="complex" src="https://static01.nyt.com/images/2020/11/03/obituaries/25maradona-ES-1/00Maradona-mediumSquareAt3X.jpg" />
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
                                <Grid item>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        <Button variant="contained" color="secondary" disabled={book.inStock === 0 ? true : false}
                                            onClick={() => dispatch(addToCart(book, cart))}>
                                            Add to cart
                                        </Button>
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
        </>
    );

}

export default Book

