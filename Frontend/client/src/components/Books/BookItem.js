import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState'
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Link } from 'react-router-dom'
import { addToCart } from '../../store/Actions'

const BookItem = ({ book }) => {

    const { state, dispatch } = useContext(DataContext)

    const { books, cart, auth, grid } = state

    const userLink = () => {
        return (
            <div>
                <Button size="small" color="primary" component={Link} to={`/book/${book.id}`}>
                    View
                </Button>
                <Button size="small" color="primary"
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
                    <Typography>
                        {book.description}
                    </Typography>
                </CardContent>
                <CardActions>

                    {!auth.user || auth.user.isAdmin ? adminLink() : userLink()}

                </CardActions>
            </Card>
        </Grid>
    )
}

export default BookItem