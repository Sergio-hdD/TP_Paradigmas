import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'


const orderDetail = ({ orderDetail, state, classes }) => {

    const { auth, orders } = state

    return (
        <>
            {
                orderDetail.map(order => (
                    <Paper spacing={2} style={{ marginTop: '30px' }}>
                        <Grid container justifyContent="center" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
                            <Typography variant="h4" noWrap>Order {order.id}</Typography>
                            <Grid item xs={6}>
                                <Typography variant="h6" color="textSecondary">Shipping</Typography>

                                <p>Name: {order.user.name}</p>
                                <p>Email: {order.user.email}</p>
                                <p>Adress: {order.adress}</p>
                                <p>Mobile: {order.mobile}</p>

                                <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                                    d-flex justify-content-between align-items-center`}>
                                    {
                                        order.delivered ? `Delivered on ${order.created_at}` : 'Not Delivered'
                                    }
                                    {
                                        auth.user.role === 'admin' && !order.delivered &&
                                        <button className="btn btn-dark text-uppercase">
                                            Mark as delivered
                                        </button>
                                    }
                                </div>

                                <Typography variant="h6" color="textSecondary">Payment</Typography>

                                {
                                    order.paymentId && <p>PaymentId: <em>{order.paymentId}</em> </p>
                                }

                                {
                                    order.paid ? `Paid on ${order.created_at}` : 'Not Paid'
                                }

                            </Grid>

                            <Grid item xs={6}>

                                <Typography variant="h6" color="textSecondary">Order items</Typography>
                                <div>
                                    {
                                        order.cart.map(item => (
                                            <Card className={classes.root} style={{ margin: '10px' }}>
                                                <CardMedia
                                                    className={classes.cover}
                                                    image="https://source.unsplash.com/random"
                                                    title="Live from space album cover"
                                                />
                                                <div className={classes.details}>
                                                    <CardContent className={classes.content}>
                                                        <Typography component="h5" variant="h5" >
                                                            {item.title}
                                                        </Typography>
                                                        <Typography variant="body2" style={{ float: 'left' }}>{`$${item.price}`}</Typography>
                                                    </CardContent>
                                                </div>
                                            </Card>

                                        ))
                                    }

                                </div>
                                <Typography variant="h5" align="center">Total: ${order.total}</Typography>


                            </Grid>

                        </Grid>
                    </Paper>

                ))
            }
        </>
    )
}

export default orderDetail
