import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default function AddressForm({ checkoutDates, handleChangeInput }) {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Shipping address
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="firstName"
                        name="firstName"
                        label="First name"
                        fullWidth
                        value={checkoutDates.firstName}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="lastName"
                        name="lastName"
                        label="Last name"
                        fullWidth
                        value={checkoutDates.lastName}
                        onChange={handleChangeInput}

                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        required
                        id="address"
                        name="address"
                        label="Address"
                        fullWidth
                        value={checkoutDates.address}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        value={checkoutDates.city}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField id="province"
                        name="province"
                        label="State/Province/Region"
                        fullWidth
                        value={checkoutDates.province}
                        onChange={handleChangeInput}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="postalCode"
                        name="postalCode"
                        label="Zip / Postal code"
                        fullWidth
                        value={checkoutDates.postalCode}
                        onChange={handleChangeInput}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}