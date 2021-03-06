import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Link } from 'react-router-dom'
import { addToCart } from '../../store/Actions'

const BookItem = ({ book }) => {

    const { state, dispatch } = useContext(DataContext)

    const { books, cart, auth } = state

    const userLink = () => {
        return (
            <div>
                <Button size="small" color="primary" component={Link} to={`/book/${book.id}`}>
                    View
                </Button>
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
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        cardMedia: {
            paddingTop: '56.25%',
        },
        cardContent: {
            flexGrow: 1,
        }
    }));

    const classes = useStyles();

    return (
        <Grid item key={book.id} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {book.title}
                    </Typography>
                    <Box mb={5}>
                        <Typography style={{ float: 'left' }}>{`$${book.price}`}</Typography>
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
                    <Typography>
                        {book.description}
                    </Typography>

                </CardContent>
                <CardActions style={{ 'justifyContent': 'center' }}>

                    {!auth.user || !auth.user.isAdmin ? userLink() : adminLink() }

                </CardActions>
            </Card>
        </Grid>
    )
}

export default BookItem