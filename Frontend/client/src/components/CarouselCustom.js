import Carousel from 'react-material-ui-carousel'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import img3 from '../assets/img/banner-1.jpg'
import img1 from '../assets/img/banner-3.jpg'
import img2 from '../assets/img/banner-2.jpg'

const CarouselCustom = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '300px',
        },
        image: {
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
                <Grid item xs={12} sm={12} md={12} className={classes.image} style={{ 'backgroundImage': `url(${props.item.imgUrl})` }} />
            </Grid>
        )
    }

    var items = [
        {
            name: "Random Name #1",
            imgUrl: img1
        },
        {
            name: "Random Name #2",
            imgUrl: img2
        }
        ,
        {
            name: "Random Name #3",
            imgUrl: img3
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