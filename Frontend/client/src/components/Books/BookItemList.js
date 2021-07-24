import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContext } from 'react';
import Container from '@material-ui/core/Container'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Link } from 'react-router-dom'
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router';


const BookItemList = ({ book }) => {

    const { state, dispatch } = useContext(DataContext)

    const { books, cart, auth } = state

    const router = useHistory()

    const userLink = () => {
        return (
            <div>
                {
                    !router.location.pathname.includes('book/') &&
                    <Button size="small" color="primary" component={Link} to={`/book/${book.id}`}>
                        View
                    </Button>
                }
                <Button size="small" color="primary" disabled={book.inStock === 0 ? true : false}
                    onClick={() => dispatch(addToCart(book, cart))}>
                    Buy
                </Button>
            </div>
        )
    }

    const adminLink = () => {
        return (
            <div>
                <Button size="small" color="secondary" component={Link} to={`/books/edit/${book.id}`}>
                    Edit
                </Button>
                <Button size="small" color="secondary"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{ data: books, id: book.id, title: book.title, type: 'DELETE_PRODUCT', show: true }]
                    })}>
                    Delete
                </Button>
            </div>
        )
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 450,
        },
        controls: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        playIcon: {
            height: 38,
            width: 38,
        },
    }));

    const classes = useStyles();

    return (
        <Container maxWidth="md" style={{ padding: '20px' }}>
            <Card className={classes.root}>
                <CardMedia
                    className={classes.cover}
                    image="https://source.unsplash.com/random"
                    title="Live from space album cover"
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                            {book.title}
                        </Typography>
                        <Box mb={3}>
                            <Typography variant="body2" style={{ float: 'left' }}>{`$${book.price}`}</Typography>
                            <Typography style={{ float: 'right' }}>
                                {
                                    book.inStock > 0
                                        ? <Typography variant="body2" style={{ color: '#4caf50' }}>
                                            In Stock: {book.inStock}
                                        </Typography>
                                        : <Typography variant="body2" style={{ color: '#e91e63' }}>
                                            Out Stock
                                        </Typography>
                                }
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" color="textSecondary">
                            {book.description}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls} style={{ 'justifyContent': 'center' }}>
                        <CardActions>

                            {!auth.user || !auth.user.isAdmin ? userLink() : adminLink()}

                        </CardActions>
                    </div>
                </div>
            </Card>
        </Container>
    )

}

export default BookItemList





/*
<Paper className={classes.paper}>
    <Grid container spacing={2}>
        <Grid item>
            <ButtonBase className={classes.image}>
                <img className={classes.img} alt="complex" src="https://source.unsplash.com/random" style={{ objectFit: 'cover' }} />
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
</Paper> */





