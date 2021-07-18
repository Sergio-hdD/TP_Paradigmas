import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


export default function PaymentForm({ checkoutDates, handleChangeInput }) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardName"
                        name="cardName"
                        label="Name on card"
                        fullWidth
                        value={checkoutDates.cardName}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cardNumber"
                        name="cardNumber"
                        label="Card number"
                        fullWidth
                        value={checkoutDates.cardNumber}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="expDate"
                        name="expiryDate"
                        label="Expiry date"
                        fullWidth
                        value={checkoutDates.expiryDate}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        id="cvv"
                        label="CVV"
                        name="cvv"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        value={checkoutDates.cvv}
                        onChange={handleChangeInput}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}