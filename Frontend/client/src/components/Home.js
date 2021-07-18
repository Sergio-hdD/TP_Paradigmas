import { useContext, useState } from 'react';
import { DataContext } from '../store/GlobalState'
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Notify from './Notify';
import CarouselCustom from '../components/CarouselCustom'
import Box from '@material-ui/core/Box';
import GridOn from '@material-ui/icons/GridOn';
import List from '@material-ui/icons/ListAltOutlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import BookItem from './Books/BookItem';
import BookItemList from './Books/BookItemList';


const Home = () => {

    const { state, dispatch } = useContext(DataContext)

    const { books, grid } = state

    function Copyright() {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                Your Website {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    const [alignment, setAlignment] = useState(grid ? 'grid' : 'list');

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

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
                <CarouselCustom />
                <Box m={3}>
                    <ToggleButtonGroup
                        value={alignment}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="grid" aria-label="left aligned"
                            onClick={() => dispatch({
                                type: 'ADD_GRID',
                                payload: true
                            })}>
                            <GridOn />
                        </ToggleButton>
                        <ToggleButton value="list" aria-label="right aligned"
                            onClick={() => dispatch({
                                type: 'ADD_GRID',
                                payload: false
                            })}>
                            <List />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {books.map((book) => (
                            grid ? <BookItem key={book.id} book={book} /> : <BookItemList key={book.id} book={book} />
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