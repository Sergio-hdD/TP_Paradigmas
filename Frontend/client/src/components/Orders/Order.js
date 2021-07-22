import { Container } from "@material-ui/core"
import { useEffect, useState, useContext } from "react"
import { makeStyles } from '@material-ui/core/styles';
import { DataContext } from "../../store/GlobalState"
import OrderDetail from './OrderDetail'

const Order = ({ match }) => {

    const { state } = useContext(DataContext)
    const { orders, auth } = state

    const [orderDetail, setOrderDetail] = useState([])

    useEffect(() => {
        const newArr = orders.filter(order => order.id == match.params.id)
        setOrderDetail(newArr)
    }, [orders, match.params.id])

    const useStyles = makeStyles((theme) => ({
        '@global': {
            ul: {
                margin: 0,
                padding: 0,
                listStyle: 'none',
            },
        },
        appBar: {
            borderBottom: `1px solid ${theme.palette.divider}`,
        },
        toolbar: {
            flexWrap: 'wrap',
        },
        toolbarTitle: {
            flexGrow: 1,
        },
        link: {
            margin: theme.spacing(1, 1.5),
        },
        heroContent: {
            padding: theme.spacing(8, 0, 6),
        },
        cardHeader: {
            backgroundColor:
                theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[100],
        },
        cardPricing: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginBottom: theme.spacing(2),
        },
        footer: {
            borderTop: `1px solid ${theme.palette.divider}`,
            marginTop: theme.spacing(8),
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
                paddingTop: theme.spacing(6),
                paddingBottom: theme.spacing(6),
            },
        },
    }));

    const classes = useStyles();

    if (!auth.user) return null;

    return (

        <Container maxWidth="md">

            <OrderDetail orderDetail={orderDetail} state={state} classes={classes} />

        </Container >

    )
}

export default Order