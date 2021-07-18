import Carousel from 'react-material-ui-carousel'
import { Paper, Button, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const CarouselCustom = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '300px',
        },
        image: {
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
    }))

    const classes = useStyles();

    function Item(props) {
        return (
            <Grid container component="main" className={classes.root}>
                <Grid item xs={12} sm={12} md={12} className={classes.image} />
            </Grid>
        )
    }

    var items = [
        {
            name: "Random Name #1",
            description: "Probably the most random thing you have ever seen!"
        },
        {
            name: "Random Name #2",
            description: "Hello World!"
        }
        ,
        {
            name: "Random Name #3",
            description: "Hello World!"
        }
    ]

    return (
        <Carousel>
            {
                items.map((item, i) => <Item key={i} item={item} />)
            }
        </Carousel>
    )
}
export default CarouselCustom