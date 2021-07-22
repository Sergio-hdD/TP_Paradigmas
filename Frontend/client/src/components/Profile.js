import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import VerifiedUser from '@material-ui/icons/AccountCircle'
import { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { Button } from '@material-ui/core'
import TableOrder from '../components/Orders/TableOrder'


const Profile = () => {

    const { state } = useContext(DataContext)

    const { auth } = state

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        cf_password: ''
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
    }

    if (!auth.user) return null;

    return (
        <Container maxWidth="md" component="main">
            <Grid container spacing={4} style={{ marginTop: '20px' }} justifyContent="center">
                <Grid item md="4" xs="12" >
                    <Typography variant="h4">
                        {auth.user.isAdmin ? 'User Admin' : 'Admin Profile'}
                    </Typography>

                    <Typography variant="h3">
                        <VerifiedUser style={{ fontSize: 150 }} />
                    </Typography>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        name="name"
                        autoFocus
                        onChange={handleChange}
                        defaultValue={auth.user.name}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        disabled={true}
                        defaultValue={auth.user.email}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        value={userData.password}
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Confirm Passoword"
                        name="cf_password"
                        onChange={handleChange}
                        value={userData.cf_password}
                    />
                    <Button color="primary" variant="contained">Update</Button>
                </Grid>
                <Grid item md="8" xs="12">
                    <Typography variant="h4" style={{marginBottom: '10px'}}>
                        Orders
                    </Typography>
                    <TableOrder />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Profile

