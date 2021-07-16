import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
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
                <Typography display="inline">{`$${book.price}`}</Typography>
                <Typography display="inline">{book.inStock}</Typography>
                <Typography>
                    {book.description}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default BookCard