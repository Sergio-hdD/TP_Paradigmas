import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles';

const BookCard = ({ book }) => {

    const useStyles = makeStyles((theme) => ({
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
                    <Typography style={{ float: 'right' }}>{book.inStock}</Typography>
                </Box>
                <Typography>
                    {book.description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default BookCard