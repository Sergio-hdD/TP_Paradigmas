import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';


const orderDetail = ({ orderDetail, state, classes }) => {

    const { auth, orders } = state

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md" component="main">
                <Grid container spacing={3} style={{ paddingTop: '20px' }}>
                    {
                        orderDetail.map((order, index) => (
                            <>
                                <Grid item key={index} xs={12} sm={12} md={12}>
                                    <Card>
                                        <CardHeader
                                            title={`Order ID: ${order.id} ${order.created_at}`}
                                            titleTypographyProps={{ align: 'left' }}
                                            className={classes.cardHeader}
                                        />
                                        <CardContent>
                                            <List dense className={classes.root}>
                                                {
                                                    order.cart.map((item, index) => (
                                                        <Typography variant="subtitle1" align="center">
                                                            <ListItem key={index} button>
                                                                <ListItemAvatar>
                                                                    <Avatar
                                                                        alt="https://source.unsplash.com/random"
                                                                        src="https://source.unsplash.com/random"
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText id={index} primary={item.title} />
                                                                <ListItemSecondaryAction>
                                                                    ${item.price}
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                            <Divider />
                                                        </Typography>
                                                    ))
                                                }
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={6}>
                                    <Card>
                                        <CardContent align="left">
                                            <Box fontWeight="fontWeightMedium" fontSize={16}>
                                                Shipping Address
                                            </Box>
                                            <Box fontSize={14} py={2}>
                                                Kelly Williams 777 Brockton Avenue, Abington MA 2351
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid item xs={12} sm={12} md={6}>
                                    <Card>
                                        <CardContent align="left">
                                            <Box fontWeight="fontWeightMedium" fontSize={16}>
                                                Total Summary
                                            </Box>
                                            <List dense className={classes.root}>

                                                <ListItem>
                                                    <ListItemText primary="Subtotal:" />
                                                    <ListItemSecondaryAction>
                                                        ${order.total}
                                                    </ListItemSecondaryAction>
                                                </ListItem>

                                                <ListItem>
                                                    <ListItemText primary="Shipping free:" />
                                                    <ListItemSecondaryAction>
                                                        $0
                                                    </ListItemSecondaryAction>
                                                </ListItem>

                                                <ListItem>
                                                    <ListItemText primary="Total:" />
                                                    <ListItemSecondaryAction>
                                                        ${order.total}
                                                    </ListItemSecondaryAction>
                                                </ListItem>

                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </>
                        ))}

                </Grid>
            </Container>
        </React.Fragment>

    )
}

export default orderDetail
