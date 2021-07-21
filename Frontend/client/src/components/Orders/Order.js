import { Button, Container } from "@material-ui/core"
import { useEffect, useState, useContext } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router"
import { DataContext } from "../../store/GlobalState"
import OrderDetail from './OrderDetail'

const Order = ({ match }) => {

    const { state } = useContext(DataContext)
    const { orders, auth } = state

    const router = useHistory()

    const [orderDetail, setOrderDetail] = useState([])

    useEffect(() => {
        const newArr = orders.filter(order => order.id == match.params.id)
        setOrderDetail(newArr)
    }, [orders])

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        paper: {
            width: "100%",
            height: "100%"
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 150,
        }
    }));

    const classes = useStyles();

    if (!auth.user) return null;

    return (

        <Container maxWidth="md">

            <OrderDetail orderDetail={orderDetail} state={state} classes={classes}/>

        </Container >

    )
}

export default Order