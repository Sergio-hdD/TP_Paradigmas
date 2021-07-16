import { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import { DataContext } from '../store/GlobalState'
import Notify from './Notify';
import { addToCart } from '../store/Actions'

const Home = () => {

    const { state, dispatch } = useContext(DataContext)

    const { books, cart, auth } = state

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                Your Website {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    const useStyles = makeStyles((theme) => ({
        icon: {
            marginRight: theme.spacing(2),
        },
        heroContent: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(8, 0, 6),
        },
        heroButtons: {
            marginTop: theme.spacing(4),
        },
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
        },
        footer: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(6),
        },
    }));

    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <Notify />
            <main>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            Album layout
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            Something short and leading about the collection below—its contents, the creator, etc.
                            Make it short and sweet, but not too short so folks don&apos;t simply skip over it
                            entirely.
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Button variant="contained" color="primary">
                                        Main call to action
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary">
                                        Secondary action
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {books.map((book) => (
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
                                        {
                                            auth && !auth.user.isAdmin && (
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

                                        {
                                            auth.user && auth.user.isAdmin && (
                                                <div>
                                                    <Button size="small" color="secondary" component={Link} to={`/books/edit/${book.id}`}>
                                                        Edit
                                                    </Button>
                                                    <Button size="small" color="secondary"
                                                    onClick={() => dispatch({
                                                        type: 'ADD_MODAL',
                                                        payload: [{data: books, id: book.id, title: book.title, type: 'DELETE_PRODUCT', show: true }]
                                                    })}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            )
                                        }

                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
            {/* Footer */}
            <footer className={classes.footer}>
                <Typography variant="h6" align="center" gutterBottom>
                    Footer
                </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Something here to give the footer a purpose!
                </Typography>
                <Copyright />
            </footer>
            {/* End footer */}
        </>
    )
}

export default Home