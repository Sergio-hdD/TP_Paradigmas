import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import VerifiedUser from '@material-ui/icons/AccountCircle'
import { useContext, useState } from 'react'
import { DataContext } from '../store/GlobalState'
import { Button } from '@material-ui/core'
import TableOrder from '../components/Orders/TableOrder'
import { validRegister } from '../utils/valid'
import { patchData } from '../utils/fetchData'

const Profile = () => {

    const { state, dispatch } = useContext(DataContext)

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

    const handleSubmit = e => {
        e.preventDefault()

        if (userData.password) {
            const errMsg = validRegister(auth.user.name, auth.user.email, userData.password, userData.cf_password)
            if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg, show: true } })

            updatePassword()
        }

        if (userData.name !== auth.user.name) updateName()

    }

    const updatePassword = () => {

        patchData('users/resetPassword', {password: userData.password}, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.msg } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg, show: true } })
            })
    }

    const updateName = async () => {

        patchData('users/updateName', {name: userData.name}, auth.token).then(res => {

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: 'AUTH', payload: {
                    token: auth.token,
                    user: res
                }
            }) 

            dispatch({ type: 'NOTIFY', payload: { success: 'Username updated Successfully.', show: true } })

        })

    }


    if (!auth.user) return null;

    return (
        <Container maxWidth="md" component="main">
            <Grid container spacing={4} style={{ marginTop: '20px' }} justifyContent="center">
                <Grid item md={4} xs={12} >
                    <Typography variant="h4">
                        {auth.user.isAdmin ? 'Admin Profile' : 'User Profile'}
                    </Typography>

                    <Typography variant="h3">
                        <VerifiedUser style={{ fontSize: 150 }} />
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Name"
                            name="name"
                            autoFocus
                            onChange={handleChange}
                            value={userData.name}
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
                            type="password"
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Confirm Passoword"
                            name="cf_password"
                            onChange={handleChange}
                            value={userData.cf_password}
                            type="password"
                        />
                        <Button color="primary" type="submit" variant="contained">Update</Button>

                    </form>
                </Grid>
                <Grid item md={8} xs={12}>
                    <Typography variant="h4" style={{ marginBottom: '10px' }}>
                        Orders
                    </Typography>
                    <TableOrder />
                </Grid>
            </Grid>
        </Container>
    )
}

export default Profile

